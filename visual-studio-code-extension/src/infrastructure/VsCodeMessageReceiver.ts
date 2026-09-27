import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '@shared/constants/vscode-message'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '@shared/config/connection'
import { logger } from '@shared/logging/logger'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

export interface RequestResponder {
  ws: WebSocket
  id: string
}

class VsCodeMessageReceiver extends BaseMessageReceiver<VsCodeMessageHandler, RequestResponder> {
  #server: WebSocketServer | null = null

  constructor() {
    super(new VsCodeMessageHandlerMap())
  }

  protected override onInit(): undefined {
    const server = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
    this.#server = server
    server.on('connection', (ws) => {
      logger.info(this, 'Chrome extension connected')
      ws.on('message', async (raw) => {
        let request: VsCodeRequest
        try {
          request = JSON.parse(raw.toString()) as VsCodeRequest
        } catch {
          logger.error(this, 'failed to parse incoming message', raw.toString())
          return
        }
        await this.dispatch(request.channel, request.content, { ws, id: request.id })
      })
      ws.on('close', () => logger.info(this, 'Chrome extension disconnected'))
    })
  }

  override close(): void {
    this.#server?.close()
    this.#server = null
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

  #sendResponse({ ws, id }: RequestResponder, status: VsCodeResponseStatus): void {
    const response: VsCodeResponse = { id, content: status }
    ws.send(JSON.stringify(response))
  }
}

export const vsCodeMessageReceiver = new VsCodeMessageReceiver()
