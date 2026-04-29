type MessageHandler = (content: Record<string, unknown>) => Promise<unknown>

export default class MessageHandlerMap {
  readonly #handlers = new Map<string, MessageHandler>()

  add(messageType: string, handler: MessageHandler): void {
    if (!this.#handlers.has(messageType)) {
      this.#handlers.set(messageType, handler)
    }
  }

  get(messageType: string): MessageHandler | undefined {
    return this.#handlers.get(messageType)
  }
}
