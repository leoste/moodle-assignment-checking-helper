import * as vscode from "vscode"
import { WebSocketServer } from "ws"
import * as path from "path"

export function activate(context: vscode.ExtensionContext) {

	console.log("VS Code Listener is aaaaaaaaaaactive.")

	const wss = new WebSocketServer({ port: 54321, host: "127.0.0.1" })

	wss.on("connection", (ws) => {
		console.log("Chrome connected!")

		ws.on("message", async (message) => {
			const incomingData = JSON.parse(message.toString())
			if (incomingData.channel === "page-info") {
				await openFiles(incomingData)
			}			
			sendResponse(incomingData, ws)
		})
	})

	// Cleanup when extension deactivates
	context.subscriptions.push({
		dispose: () => wss.close()
	})
}

export function deactivate() { }

async function sendResponse(incomingData: any, ws: any) {
	const result = "message received"
	const reply = {
		id: incomingData.id,
		content: result
	}
	ws.send(JSON.stringify(reply))
}

const SAFE_BINARY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.pdf']);

async function openFiles(incomingData: any) {
	await vscode.commands.executeCommand("workbench.action.closeAllEditors")

		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			const rootUri = vscode.workspace.workspaceFolders[0].uri

			const targetEntry = await findEntryByName(rootUri, incomingData.content)

			if (targetEntry) {
				const targetUri = vscode.Uri.joinPath(rootUri, targetEntry[0])

				const fileEntries = await vscode.workspace.fs.readDirectory(targetUri)
				let fileCount = 0

				for (const [fileName, type] of fileEntries) {
					if (type === vscode.FileType.File) {
						const column = (fileCount % 3) + 1
						await openFile(targetUri, fileName, column, () => { fileCount++ } )
					}
				}
			}
		}
}

async function openFile(targetUri: vscode.Uri, fileName: string, column: number, onSuccessfulFileOpen: ()=>void) {
	const fileUri = vscode.Uri.joinPath(targetUri, fileName)
	const ext = path.extname(fileName).toLowerCase()
	
	if (SAFE_BINARY_EXTENSIONS.has(ext)) {
		try {
			await vscode.commands.executeCommand('vscode.open', fileUri, {
				preview: false,
				viewColumn: column,
				preserveFocus: false
			});
			onSuccessfulFileOpen()
		} catch {}
		return
	}

	try {
		const doc = await vscode.workspace.openTextDocument(fileUri)
		await vscode.window.showTextDocument(doc, {
			preview: false,
			viewColumn: column,
			preserveFocus: false
		})
		onSuccessfulFileOpen()
	}
	catch {
		
	}
}

async function findEntryByName(rootUri: vscode.Uri, wantedName: string) {
	const rootEntries = await vscode.workspace.fs.readDirectory(rootUri)
	return rootEntries.find(([name, type]) =>
				type === vscode.FileType.Directory && name.startsWith(wantedName)
			)
}