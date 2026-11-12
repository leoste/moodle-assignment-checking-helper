import { announcer } from '../../communication/announcer/Announcer'

const REQUEST_TIMEOUT_MS = 5000

interface PendingRequest<TAnswer> {
  resolve: (answer: TAnswer) => void
  timer: ReturnType<typeof setTimeout>
}

// Pairs the requests sent over a lane with their answers, and times them out.
// The subclasses put the requests on their lane and say what a request gets when no answer comes.
export default abstract class BaseRequestTracker<TMessage extends object, TAnswer> {
  readonly #requests = new Map<string, PendingRequest<TAnswer>>()

  // The connection closed, so no answers will come.
  cancelAll(): void {
    announcer.announceLogError(this, `connection lost, cancelling ${this.#requests.size} pending request(s)`)
    this.#requests.forEach((req) => {
      clearTimeout(req.timer)
      req.resolve(this.getUnreachableAnswer())
    })
    this.#requests.clear()
  }

  // `send` puts the request on the lane and rejects if it can't.
  protected track(message: TMessage, send: (request: TMessage & { id: string }) => Promise<void>): Promise<TAnswer> {
    return new Promise((resolve) => {
      const id = crypto.randomUUID()
      const key = this.getKey(message)
      const timer = setTimeout(() => {
        this.#cleanup(id)
        announcer.announceLogError(this, `request ${id} (${key}) timed out`)
        resolve(this.getNoAnswer())
      }, REQUEST_TIMEOUT_MS)

      this.#requests.set(id, { resolve, timer })

      announcer.announceLog(this, `request ${id} (${key}) sent`)
      send({ ...message, id }).catch((err) => {
        this.#cleanup(id)
        announcer.announceLogError(this, `request ${id} (${key}) could not be sent`, err)
        resolve(this.getUnreachableAnswer())
      })
    })
  }

  protected complete(id: string, answer: TAnswer): void {
    const req = this.#requests.get(id)
    if (!req) return
    announcer.announceLog(this, `request ${id} answered: ${answer}`)
    clearTimeout(req.timer)
    req.resolve(answer)
    this.#requests.delete(id)
  }

  // The message's type or channel, for the log.
  protected abstract getKey(message: TMessage): string

  // What a request gets when its answer doesn't come in time.
  protected abstract getNoAnswer(): TAnswer

  // What a request gets when it can't be sent, or its connection closes before the answer comes.
  protected abstract getUnreachableAnswer(): TAnswer

  #cleanup(id: string): void {
    const req = this.#requests.get(id)
    if (!req) return
    clearTimeout(req.timer)
    this.#requests.delete(id)
  }
}
