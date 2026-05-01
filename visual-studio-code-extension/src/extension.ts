import * as vscode from 'vscode'
import { WebSocketServer, WebSocket } from 'ws'
import type { WebSocketMessage } from '@shared/types/WebSocketProtocol'
import { handlePageInfo } from './handler/PageInfoHandler'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from './config'
import type { ChannelHandler } from './types'

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

  const wss = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })

  wss.on('connection', (ws) => {
    console.log('Chrome extension connected.')

    ws.on('message', async (raw) => {
      let data: WebSocketMessage
      try {
        data = JSON.parse(raw.toString()) as WebSocketMessage
      } catch {
        console.error('Failed to parse incoming message:', raw.toString())
        return
      }

      const handler = channelHandlers[data.channel]
      if (!handler) {
        console.warn(`[WebSocketServer] No handler for channel: "${data.channel}"`)
        sendResponse(ws, data.id, 'unhandled')
        return
      }

      try {
        await handler(data, ws)
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
