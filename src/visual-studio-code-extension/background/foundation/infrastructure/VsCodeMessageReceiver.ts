import BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/business/types/VsCodeMessage'
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '@shared/foundation/constants/vscode-message'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from '@shared/business/config/connection'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { connectionAnnouncer } from '@shared/communication/announcer/ConnectionAnnouncer'
import { getConnectedStatus, getPortInUseStatus, getServerErrorStatus, getWaitingStatus } from '@shared/business/rules/status-rules'
import { isAllowedOrigin } from '../../business/rules/connection-rules'
import VsCodeMessageHandlerMap from '../../../shared/foundation/object/VsCodeMessageHandlerMap'
import type { VsCodeMessageHandler } from '../../../shared/business/types/VsCodeMessageHandler'

const ADDRESS_IN_USE_ERROR_CODE = 'EADDRINUSE'
const POLICY_VIOLATION_CLOSE_CODE = 1008

export interface RequestResponder {
  ws: WebSocket
  id: string
}

// The server is started by ReceptionService: only one VS Code window can have the port.
class VsCodeMessageReceiver extends BaseMessageReceiver<VsCodeMessageHandler, RequestResponder> {
  #server: WebSocketServer | null = null

  constructor() {
    super(new VsCodeMessageHandlerMap())
  }

  // True once the server listens, false when it couldn't start, e.g. because another window has the port.
  listen(): Promise<boolean> {
    return new Promise((resolve) => {
      const server = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })
      this.#server = server
      let listening = false
      let connectionCount = 0

      server.on('listening', () => {
        listening = true
        connectionAnnouncer.announceStatus(getWaitingStatus())
        resolve(true)
      })
      server.on('error', (err: NodeJS.ErrnoException) => {
        logAnnouncer.announceLogError(this, 'WebSocket server error', err)
        connectionAnnouncer.announceStatus(err.code === ADDRESS_IN_USE_ERROR_CODE ? getPortInUseStatus(WEBSOCKET_PORT) : getServerErrorStatus())
        if (listening) return
        if (this.#server === server) this.#server = null
        server.close()
        resolve(false)
      })
      server.on('connection', (ws, request) => {
        const origin = request.headers.origin
        if (!isAllowedOrigin(origin)) {
          logAnnouncer.announceLogError(this, `refused a connection from origin ${origin}`)
          ws.close(POLICY_VIOLATION_CLOSE_CODE)
          return
        }
        logAnnouncer.announceLog(this, `connected: ${origin ?? 'another VS Code window'}`)
        connectionCount++
        connectionAnnouncer.announceStatus(getConnectedStatus())
        ws.on('message', async (raw) => {
          let request: VsCodeRequest
          try {
            request = JSON.parse(raw.toString()) as VsCodeRequest
          } catch {
            logAnnouncer.announceLogError(this, 'failed to parse incoming message', raw.toString())
            return
          }
          await this.dispatch(request.channel, request.content, { ws, id: request.id })
        })
        ws.on('close', () => {
          logAnnouncer.announceLog(this, `disconnected: ${origin ?? 'another VS Code window'}`)
          connectionCount--
          // The connections of a stopped server close without changing the status.
          if (connectionCount === 0 && this.#server === server) connectionAnnouncer.announceStatus(getWaitingStatus())
        })
      })
    })
  }

  // Closes the server and its connections, e.g. when another window takes the reception over.
  stop(): void {
    const server = this.#server
    if (!server) return
    this.#server = null
    // Closing the server doesn't close its connections.
    server.clients.forEach(client => client.close())
    server.close()
  }

  override close(): void {
    this.stop()
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
