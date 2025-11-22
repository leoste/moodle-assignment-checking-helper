export default class MessageHandlerMap {
  
  add(message, messageHandler) {
    if (!this.#messageHandlers.has(message)) {
      this.#messageHandlers.set(message, messageHandler)
    }
  }

  getMessageHandler(message) {
    return this.#messageHandlers.get(message)
  }
  
  #messageHandlers = new Map()
}