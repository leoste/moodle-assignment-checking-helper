import type { MessageHandler } from '../types/MessageHandler'
import { announcer } from '../announcer/Announcer'

export default class MessageHandlerMap<T extends MessageHandler> {
  readonly #handlers = new Map<string, T>()

  add(messageType: string, handler: T): void {
    if (this.#handlers.has(messageType)) {
      announcer.announceLogError(this, `handler already registered for ${messageType}, keeping the first one`)
      return
    }
    this.#handlers.set(messageType, handler)
  }

  get(messageType: string): T | undefined {
    return this.#handlers.get(messageType)
  }
}
