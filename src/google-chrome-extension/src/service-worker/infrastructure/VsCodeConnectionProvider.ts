import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import WebSocketConnection from '../object/WebSocketConnection'
import type { VsCodeMessage, VsCodeRequest, VsCodeRequestStatus, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { REQUEST_STATUS_NO_ANSWER, REQUEST_STATUS_UNREACHABLE } from '@shared/constants/vscode-message'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { getConnectedStatus, getDisconnectedStatus, getReconnectingStatus, getWaitingStatus } from '@shared/rules/status-rules'

const REQUEST_TIMEOUT_MS = 5000

interface PendingRequest {
  resolve: (status: VsCodeRequestStatus) => void
  timer: ReturnType<typeof setTimeout>
}

class VsCodeConnectionProvider extends BaseInfrastructure {
  readonly #connection = new WebSocketConnection()
  readonly #requests = new Map<string, PendingRequest>()

  constructor() {
    super()
    this.#connection.onConnecting = () => statusReporter.report(getReconnectingStatus())
    this.#connection.onConnect = () => statusReporter.report(getConnectedStatus())
    this.#connection.onMessage = (raw) => this.#handleMessage(raw)
    this.#connection.onDisconnect = (wasConnected) => {
      statusReporter.report(wasConnected ? getWaitingStatus() : getDisconnectedStatus())
      this.#cancelAll()
    }
  }

  protected override onInit(): undefined {
    statusReporter.report(getWaitingStatus())
  }

  post(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    return new Promise((resolve) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        this.#cleanup(id)
        logger.error(this, `request ${id} (${message.channel}) timed out`)
        resolve(REQUEST_STATUS_NO_ANSWER)
      }, REQUEST_TIMEOUT_MS)

      this.#requests.set(id, { resolve, timer })

      const request: VsCodeRequest = { ...message, id }
      logger.info(this, `request ${id} (${message.channel}) sent`)
      this.#connection.send(JSON.stringify(request)).catch((err) => {
        this.#cleanup(id)
        logger.error(this, `request ${id} (${message.channel}) could not be sent`, err)
        resolve(REQUEST_STATUS_UNREACHABLE)
      })
    })
  }

  #handleMessage(raw: string): void {
    let parsed: VsCodeResponse
    try {
      parsed = JSON.parse(raw) as VsCodeResponse
    } catch {
      logger.error(this, 'failed to parse incoming message', raw)
      return
    }
    this.#complete(parsed.id, parsed.content)
  }

  #complete(id: string, content: VsCodeResponseStatus): void {
    const req = this.#requests.get(id)
    if (!req) return
    logger.info(this, `request ${id} answered: ${content}`)
    clearTimeout(req.timer)
    req.resolve(content)
    this.#requests.delete(id)
  }

  #cleanup(id: string): void {
    const req = this.#requests.get(id)
    if (!req) return
    clearTimeout(req.timer)
    this.#requests.delete(id)
  }

  #cancelAll(): void {
    logger.error(this, `connection lost, cancelling ${this.#requests.size} pending request(s)`)
    this.#requests.forEach((req) => {
      clearTimeout(req.timer)
      req.resolve(REQUEST_STATUS_UNREACHABLE)
    })
    this.#requests.clear()
  }
}

export const vsCodeConnectionProvider = new VsCodeConnectionProvider()
