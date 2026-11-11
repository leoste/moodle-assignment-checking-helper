import type { VsCodeMessage, VsCodeRequest, VsCodeRequestStatus, VsCodeResponse, VsCodeResponseStatus } from '../types/VsCodeMessage'
import { REQUEST_STATUS_NO_ANSWER, REQUEST_STATUS_UNREACHABLE } from '../constants/vscode-message'
import { logger } from '../reporting/logger'

const REQUEST_TIMEOUT_MS = 5000

interface PendingRequest {
  resolve: (status: VsCodeRequestStatus) => void
  timer: ReturnType<typeof setTimeout>
}

// Pairs the requests sent over a WebSocket with their answers. Used by the Chrome extension, and by a VS Code window
// asking the receiving window to hand the reception over.
export default class VsCodeRequestTracker {
  readonly #requests = new Map<string, PendingRequest>()

  // `send` puts the request on the WebSocket and rejects if it can't.
  post(message: VsCodeMessage, send: (rawString: string) => Promise<void>): Promise<VsCodeRequestStatus> {
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
      send(JSON.stringify(request)).catch((err) => {
        this.#cleanup(id)
        logger.error(this, `request ${id} (${message.channel}) could not be sent`, err)
        resolve(REQUEST_STATUS_UNREACHABLE)
      })
    })
  }

  handleMessage(raw: string): void {
    let parsed: VsCodeResponse
    try {
      parsed = JSON.parse(raw) as VsCodeResponse
    } catch {
      logger.error(this, 'failed to parse incoming message', raw)
      return
    }
    this.#complete(parsed.id, parsed.content)
  }

  // The connection closed, so no answers will come.
  cancelAll(): void {
    logger.error(this, `connection lost, cancelling ${this.#requests.size} pending request(s)`)
    this.#requests.forEach((req) => {
      clearTimeout(req.timer)
      req.resolve(REQUEST_STATUS_UNREACHABLE)
    })
    this.#requests.clear()
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
}
