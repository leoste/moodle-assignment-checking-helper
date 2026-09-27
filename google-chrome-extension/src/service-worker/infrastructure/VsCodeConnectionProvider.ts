import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import WebSocketConnection from '../object/WebSocketConnection'
import type { VsCodeMessage, VsCodeRequest, VsCodeResponse, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { logger } from '@shared/logging/logger'

const REQUEST_TIMEOUT_MS = 5000

interface PendingRequest {
  resolve: (value: VsCodeResponseStatus) => void
  reject: (reason: unknown) => void
  timer: ReturnType<typeof setTimeout>
}

class VsCodeConnectionProvider extends BaseInfrastructure {
  readonly #connection = new WebSocketConnection()
  readonly #requests = new Map<string, PendingRequest>()

  constructor() {
    super()
    this.#connection.onMessage = (raw) => this.#handleMessage(raw)
    this.#connection.onDisconnect = () => this.#cancelAll()
  }

  post(message: VsCodeMessage): Promise<VsCodeResponseStatus> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        this.#cleanup(id)
        logger.error(this, `request ${id} (${message.channel}) timed out`)
        reject(new Error('WebSocket request timed out'))
      }, REQUEST_TIMEOUT_MS)

      this.#requests.set(id, { resolve, reject, timer })

      const request: VsCodeRequest = { ...message, id }
      logger.info(this, `request ${id} (${message.channel}) sent`)
      this.#connection.send(JSON.stringify(request)).catch((err) => {
        this.#cleanup(id)
        logger.error(this, `request ${id} (${message.channel}) could not be sent`, err)
        reject(err)
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
      req.reject(new Error('WebSocket connection lost'))
    })
    this.#requests.clear()
  }
}

export const vsCodeConnectionProvider = new VsCodeConnectionProvider()
