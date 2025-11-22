import MessageHandlerMap from "../collection/MessageHandlerMap.js"

export default class BaseController {

  static #oneTimeInitiated = false
  static #messageHandlerMap

  init() {
    this.#tryOneTimeInit()
  }

  addMessageHandler(messageType, messageHandler) {
    BaseController.#messageHandlerMap.add(messageType, messageHandler)
  }

  #tryOneTimeInit() {
    if (!BaseController.#oneTimeInitiated) {
      this.#oneTimeInit()
      BaseController.#oneTimeInitiated = true
    }    
  }

  #oneTimeInit() {
    this.#initMessageHandlerMap()
    this.#initListener()
  }

  #initMessageHandlerMap() {
    BaseController.#messageHandlerMap = new MessageHandlerMap()
  }

  #initListener() {
    chrome.runtime.onMessage.addListener(this.#listenerCallback)
  }

  #listenerCallback = (message, sender, sendResponse) => {
    this.#handleMessage(message, sendResponse)    
    return true
  }

  async #handleMessage(message, sendResponse) {
    const messageHandler = BaseController.#messageHandlerMap.get(message.type)
    const response = await messageHandler(message.content)
    sendResponse(response)
  }
}
