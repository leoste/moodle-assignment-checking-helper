import MessageHandlerMap from "../collection/MessageHandlerMap.js"

export default class BaseController {

  static #oneTimeInitiated = false
  static #messageHandlerMap

  init() {
    this.#tryOneTimeInit()
  }

  addMessageHandler(message, responseHandler) {
    BaseController.#messageHandlerMap.add(message, responseHandler)
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
    let messageHandler = BaseController.#messageHandlerMap.getMessageHandler(message)
    let response = await messageHandler()    
    sendResponse(response)
  }
}
