import CloseableBaseController from './CloseableBaseController'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { WebSocketMessage } from '@shared/types/WebSocketProtocol'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '../config'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

/**
 * Base class for controllers handling WebSocket messages from the Chrome extension, and at the
 * same time the singleton dispatcher for them: the handler map and the WebSocket server are
 * static and shared by all subclasses (set up once via onOneTimeInit).
 */
export default class VsCodeWebSocketController extends CloseableBaseController {
  static #messageHandlerMap: VsCodeMessageHandlerMap
  static #wss: WebSocketServer | null = null

  close(): void {
    VsCodeWebSocketController.#wss?.close()
    VsCodeWebSocketController.#wss = null
  }

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initWebSocketServer()
  }

  addMessageHandler(channel: string, handler: VsCodeMessageHandler): void {
    VsCodeWebSocketController.#messageHandlerMap.add(channel, handler)
  }

  #initMessageHandlerMap(): void {
    VsCodeWebSocketController.#messageHandlerMap = new VsCodeMessageHandlerMap()
  }

  #initWebSocketServer(): void {
    const wss = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
    VsCodeWebSocketController.#wss = wss
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
        await this.#handleMessage(data, ws)
      })
      ws.on('close', () => console.log('Chrome extension disconnected.'))
    })
  }

  async #handleMessage(data: WebSocketMessage, ws: WebSocket): Promise<void> {
    const handler = VsCodeWebSocketController.#messageHandlerMap.get(data.channel)
    if (!handler) {
      console.warn(`[VsCodeWebSocketController] No handler for channel: "${data.channel}"`)
      this.#sendResponse(ws, data.id, 'unhandled')
      return
    }
    try {
      await handler(data.content as Record<string, unknown>)
      this.#sendResponse(ws, data.id, 'ok')
    } catch (err) {
      console.error(`Handler error for channel "${data.channel}":`, err)
      this.#sendResponse(ws, data.id, 'error')
    }
  }

  #sendResponse(ws: WebSocket, id: string, content: unknown): void {
    ws.send(JSON.stringify({ id, content }))
  }
}
