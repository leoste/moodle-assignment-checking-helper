import WebSocketProvider from './WebSocketProvider'
import type { WebSocketResponse } from '@shared/types/WebSocketProtocol'

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  timer: ReturnType<typeof setTimeout>
}

class VsCodeConnectionProvider {
  readonly #provider = new WebSocketProvider()
  readonly #requests = new Map<string, PendingRequest>()
  readonly #timeoutMs = 5000

  constructor() {
    this.#provider.onMessage = (raw) => this.#handleMessage(raw)
    this.#provider.onDisconnect = () => this.#cancelAll()
  }

  post(channel: string, content: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        this.#cleanup(id)
        reject(new Error('WebSocket request timed out'))
      }, this.#timeoutMs)

      this.#requests.set(id, { resolve, reject, timer })

      const payload = JSON.stringify({ id, channel, content })
      this.#provider.send(payload).catch((err) => {
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

  #complete(id: string, content: unknown): void {
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
