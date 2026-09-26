import BaseMessageController from '@shared/controller/BaseMessageController'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '@shared/constants/vscode-message'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '@shared/config/connection'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

interface RequestResponder {
  ws: WebSocket
  id: string
}

/**
 * Base class for controllers handling WebSocket messages from the Chrome extension, and at the
 * same time the singleton dispatcher for them: the handler map and the WebSocket server are
 * static and shared by all subclasses (set up once via onOneTimeInit).
 */
export default class VsCodeMessageController extends BaseMessageController<VsCodeMessageHandler, RequestResponder> {
  static #messageHandlerMap: VsCodeMessageHandlerMap
  static #wss: WebSocketServer | null = null

  override close(): void {
    VsCodeMessageController.#wss?.close()
    VsCodeMessageController.#wss = null
  }

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initWebSocketServer()
  }

  protected getHandlerMap(): VsCodeMessageHandlerMap {
    return VsCodeMessageController.#messageHandlerMap
  }

  protected respondHandled(responder: RequestResponder): void {
    this.#sendResponse(responder, RESPONSE_STATUS_OK)
  }

  protected respondUnhandled(responder: RequestResponder): void {
    this.#sendResponse(responder, RESPONSE_STATUS_UNHANDLED)
  }

  protected respondError(responder: RequestResponder): void {
    this.#sendResponse(responder, RESPONSE_STATUS_ERROR)
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
        await this.dispatch(request.channel, request.content as Record<string, unknown>, { ws, id: request.id })
      })
      ws.on('close', () => console.log('Chrome extension disconnected.'))
    })
  }

  #sendResponse({ ws, id }: RequestResponder, status: VsCodeResponseStatus): void {
    const response: VsCodeResponse = { id, content: status }
    ws.send(JSON.stringify(response))
  }
}
