import type { MessageHandler } from '../types/MessageHandler'

export default class MessageHandlerMap<T extends MessageHandler> {
  readonly #handlers = new Map<string, T>()

  add(messageType: string, handler: T): void {
    if (!this.#handlers.has(messageType)) {
      this.#handlers.set(messageType, handler)
    }
  }

  get(messageType: string): T | undefined {
    return this.#handlers.get(messageType)
  }
}
