import BaseController from '@shared/controller/BaseController'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { WebSocketMessage } from '@shared/types/WebSocketProtocol'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '../config'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

export default class VsCodeBaseController extends BaseController {
  static #messageHandlerMap: VsCodeMessageHandlerMap
  static #wss: WebSocketServer | null = null

  close(): void {
    VsCodeBaseController.#wss?.close()
    VsCodeBaseController.#wss = null
  }

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initWebSocketServer()
  }

  addMessageHandler(channel: string, handler: VsCodeMessageHandler): void {
    VsCodeBaseController.#messageHandlerMap.add(channel, handler)
  }

  #initMessageHandlerMap(): void {
    VsCodeBaseController.#messageHandlerMap = new VsCodeMessageHandlerMap()
  }

  #initWebSocketServer(): void {
    const wss = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
    VsCodeBaseController.#wss = wss
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
    const handler = VsCodeBaseController.#messageHandlerMap.get(data.channel)
    if (!handler) {
      console.warn(`[VsCodeBaseController] No handler for channel: "${data.channel}"`)
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
