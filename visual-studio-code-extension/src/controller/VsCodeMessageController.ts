import CloseableBaseController from './CloseableBaseController'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '@shared/constants/vscode-message'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '@shared/config/connection'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

/**
 * Base class for controllers handling WebSocket messages from the Chrome extension, and at the
 * same time the singleton dispatcher for them: the handler map and the WebSocket server are
 * static and shared by all subclasses (set up once via onOneTimeInit).
 */
export default class VsCodeMessageController extends CloseableBaseController {
  static #messageHandlerMap: VsCodeMessageHandlerMap
  static #wss: WebSocketServer | null = null

  close(): void {
    VsCodeMessageController.#wss?.close()
    VsCodeMessageController.#wss = null
  }

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initWebSocketServer()
  }

  addMessageHandler(channel: string, handler: VsCodeMessageHandler): void {
    VsCodeMessageController.#messageHandlerMap.add(channel, handler)
  }

  #initMessageHandlerMap(): void {
    VsCodeMessageController.#messageHandlerMap = new VsCodeMessageHandlerMap()
  }

  #initWebSocketServer(): void {
    const wss = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
    VsCodeMessageController.#wss = wss
    wss.on('connection', (ws) => {
      console.log('Chrome extension connected.')
      ws.on('message', async (raw) => {
        let request: VsCodeRequest
        try {
          request = JSON.parse(raw.toString()) as VsCodeRequest
        } catch {
          console.error('Failed to parse incoming message:', raw.toString())
          return
        }
        await this.#handleRequest(request, ws)
      })
      ws.on('close', () => console.log('Chrome extension disconnected.'))
    })
  }

  async #handleRequest(request: VsCodeRequest, ws: WebSocket): Promise<void> {
    const handler = VsCodeMessageController.#messageHandlerMap.get(request.channel)
    if (!handler) {
      console.warn(`[VsCodeMessageController] No handler for channel: "${request.channel}"`)
      this.#sendResponse(ws, request.id, RESPONSE_STATUS_UNHANDLED)
      return
    }
    try {
      await handler(request.content as Record<string, unknown>)
      this.#sendResponse(ws, request.id, RESPONSE_STATUS_OK)
    } catch (err) {
      console.error(`Handler error for channel "${request.channel}":`, err)
      this.#sendResponse(ws, request.id, RESPONSE_STATUS_ERROR)
    }
  }

  #sendResponse(ws: WebSocket, id: string, status: VsCodeResponseStatus): void {
    const response: VsCodeResponse = { id, content: status }
    ws.send(JSON.stringify(response))
  }
}
