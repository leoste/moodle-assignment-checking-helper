import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '@shared/constants/vscode-message'
import { CHROME_EXTENSION_ORIGIN, WEBSOCKET_HOST, WEBSOCKET_PORT } from '@shared/config/connection'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { getConnectedStatus, getPortInUseStatus, getServerErrorStatus, getWaitingStatus } from '@shared/rules/status-rules'
import VsCodeMessageHandlerMap from '../shared/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../shared/types/VsCodeMessageHandler'

const ADDRESS_IN_USE_ERROR_CODE = 'EADDRINUSE'
const POLICY_VIOLATION_CLOSE_CODE = 1008

export interface RequestResponder {
  ws: WebSocket
  id: string
}

class VsCodeMessageReceiver extends BaseMessageReceiver<VsCodeMessageHandler, RequestResponder> {
  #server: WebSocketServer | null = null
  #connectionCount = 0

  constructor() {
    super(new VsCodeMessageHandlerMap())
  }

  protected override onInit(): undefined {
    const server = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
    this.#server = server
    server.on('listening', () => statusReporter.report(getWaitingStatus()))
    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error(this, 'WebSocket server error', err)
      statusReporter.report(err.code === ADDRESS_IN_USE_ERROR_CODE ? getPortInUseStatus(WEBSOCKET_PORT) : getServerErrorStatus())
    })
    server.on('connection', (ws, request) => {
      if (request.headers.origin !== CHROME_EXTENSION_ORIGIN) {
        logger.error(this, `refused a connection from origin ${request.headers.origin ?? '(none)'}`)
        ws.close(POLICY_VIOLATION_CLOSE_CODE)
        return
      }
      logger.info(this, 'Chrome extension connected')
      this.#connectionCount++
      statusReporter.report(getConnectedStatus())
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
      ws.on('close', () => {
        logger.info(this, 'Chrome extension disconnected')
        this.#connectionCount--
        if (this.#connectionCount === 0) statusReporter.report(getWaitingStatus())
      })
    })
  }

  override close(): void {
    this.#server?.close()
    this.#server = null
  }

  // A handler can answer with its own status, otherwise a handled request is answered with ok.
  protected respondHandled(responder: RequestResponder, response: unknown): void {
    this.#sendResponse(responder, (response as VsCodeResponseStatus | undefined) ?? RESPONSE_STATUS_OK)
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
