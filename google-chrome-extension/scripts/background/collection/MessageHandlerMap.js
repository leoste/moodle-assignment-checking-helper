export default class MessageHandlerMap {
  
  add(messageType, messageHandler) {
    if (!this.#messageHandlers.has(messageType)) {
      this.#messageHandlers.set(messageType, messageHandler)
    }
  }

  get(messageType) {
    return this.#messageHandlers.get(messageType)
  }
  
  #messageHandlers = new Map()
}