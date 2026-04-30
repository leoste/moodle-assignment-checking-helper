import * as vscode from 'vscode'
import { WebSocketServer, WebSocket } from 'ws'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IncomingMessage {
  id: string
  channel: string
  content: unknown
}

type ChannelHandler = (data: IncomingMessage, ws: WebSocket) => Promise<void>

// ---------------------------------------------------------------------------
// Channel dispatch map
// Mirrors the BaseController pattern in the Chrome extension.
// Add entries here as new channels are needed.
// ---------------------------------------------------------------------------

const channelHandlers: Record<string, ChannelHandler> = {
  'page-info': handlePageInfo,
}

// ---------------------------------------------------------------------------
// Extension lifecycle
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
  console.log('Moodle Checking Helper: VS Code extension active.')

  const wss = new WebSocketServer({ port: 54321, host: '127.0.0.1' })

  wss.on('connection', (ws) => {
    console.log('Chrome extension connected.')

    ws.on('message', async (raw) => {
      let data: IncomingMessage
      try {
        data = JSON.parse(raw.toString()) as IncomingMessage
      } catch {
        console.error('Failed to parse incoming message:', raw.toString())
        return
      }

      const handler = channelHandlers[data.channel]
      try {
        if (handler) await handler(data, ws)
        sendResponse(ws, data.id, 'ok')
      } catch (err) {
        console.error(`Handler error for channel "${data.channel}":`, err)
        sendResponse(ws, data.id, 'error')
      }
    })

    ws.on('close', () => console.log('Chrome extension disconnected.'))
  })

  context.subscriptions.push({ dispose: () => wss.close() })
}

export function deactivate(): void {}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sendResponse(ws: WebSocket, id: string, content: unknown): void {
  ws.send(JSON.stringify({ id, content }))
}

// ---------------------------------------------------------------------------
// Channel: page-info
// Opens all files in the folder matching the student's name.
// ---------------------------------------------------------------------------


const openSubDirectories = true;
const SAFE_BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.pdf',
])

async function handlePageInfo(data: IncomingMessage, _ws: WebSocket): Promise<void> {
  const studentName = data.content as string
  if (!studentName) return

  await vscode.commands.executeCommand('workbench.action.closeAllEditors')

  const folders = vscode.workspace.workspaceFolders
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage('Moodle Helper: No workspace folder open.')
    return
  }

  const rootUri = folders[0].uri
  const targetEntry = await findDirectoryByName(rootUri, studentName)

  if (!targetEntry) {
    vscode.window.showWarningMessage(`Moodle Helper: No folder found for "${studentName}".`)
    return
  }

  const targetUri = vscode.Uri.joinPath(rootUri, targetEntry)
  let files: [vscode.Uri, string][] = [];
  if (openSubDirectories) {
    files = await collectFiles(targetUri);
  } else {
    const entries = await vscode.workspace.fs.readDirectory(targetUri);
    files = entries
      .filter(([_, type]) => type === vscode.FileType.File)
      .map(([fileName]) => [targetUri, fileName]);
  }

  let fileCount = 0;
  for (const [dirUri, fileName] of files) {
    const column = (fileCount % 2) + 1;
    const opened = await openFile(dirUri, fileName, column);
    if (opened) fileCount++;
  }

    async function collectFiles(dirUri: vscode.Uri): Promise<[vscode.Uri, string][]> {
    let result: [vscode.Uri, string][] = [];
    const entries = await vscode.workspace.fs.readDirectory(dirUri);
    for (const [name, type] of entries) {
        if (type === vscode.FileType.File) {
        result.push([dirUri, name]);
        } else if (type === vscode.FileType.Directory) {
        result = result.concat(await collectFiles(vscode.Uri.joinPath(dirUri, name)));
        }
    }
    return result;
    }
}

async function findDirectoryByName(
  rootUri: vscode.Uri,
  wantedName: string
): Promise<string | undefined> {
  const entries = await vscode.workspace.fs.readDirectory(rootUri)
  const match = entries.find(
    ([name, type]) => type === vscode.FileType.Directory && name.startsWith(wantedName)
  )
  return match?.[0]
}

async function openFile(
  dirUri: vscode.Uri,
  fileName: string,
  column: number
): Promise<boolean> {
  const fileUri = vscode.Uri.joinPath(dirUri, fileName)
  const ext = path.extname(fileName).toLowerCase()
  const options = { preview: false, viewColumn: column, preserveFocus: false }

  try {
    if (SAFE_BINARY_EXTENSIONS.has(ext)) {
      await vscode.commands.executeCommand('vscode.open', fileUri, options)
    } else {
      const doc = await vscode.workspace.openTextDocument(fileUri)
      await vscode.window.showTextDocument(doc, options)
    }
    return true
  } catch {
    return false
  }
}
