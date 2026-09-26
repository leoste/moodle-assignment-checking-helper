import WebSocketProvider from './WebSocketProvider'
import type { WebSocketMessage, WebSocketResponse, WebSocketResponseStatus } from '@shared/types/WebSocketProtocol'
import type { BasePayload } from '@shared/types/payload/BasePayload'

const REQUEST_TIMEOUT_MS = 5000

interface PendingRequest {
  resolve: (value: WebSocketResponseStatus) => void
  reject: (reason: unknown) => void
  timer: ReturnType<typeof setTimeout>
}

class VsCodeConnectionProvider {
  readonly #provider = new WebSocketProvider()
  readonly #requests = new Map<string, PendingRequest>()

  constructor() {
    this.#provider.onMessage = (raw) => this.#handleMessage(raw)
    this.#provider.onDisconnect = () => this.#cancelAll()
  }

  post(channel: string, content: BasePayload): Promise<WebSocketResponseStatus> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        this.#cleanup(id)
        reject(new Error('WebSocket request timed out'))
      }, REQUEST_TIMEOUT_MS)

      this.#requests.set(id, { resolve, reject, timer })

      const message: WebSocketMessage = { id, channel, content }
      this.#provider.send(JSON.stringify(message)).catch((err) => {
        this.#cleanup(id)
        reject(err)
      })
    })
  }

  #handleMessage(raw: string): void {
    let parsed: WebSocketResponse
    try {
      parsed = JSON.parse(raw) as WebSocketResponse
    } catch {
      console.error('[VsCodeConnectionProvider] Failed to parse incoming message:', raw)
      return
    }
    this.#complete(parsed.id, parsed.content)
  }

  #complete(id: string, content: WebSocketResponseStatus): void {
    const req = this.#requests.get(id)
    if (!req) return
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
    this.#requests.forEach((req) => {
      clearTimeout(req.timer)
      req.reject(new Error('WebSocket connection lost'))
    })
    this.#requests.clear()
  }
}

export const vsCodeConnectionProvider = new VsCodeConnectionProvider()
