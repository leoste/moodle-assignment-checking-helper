import MessageHandlerMap from '../collection/MessageHandlerMap'

export default class BaseController {

  static #oneTimeInitiated = false
  static #messageHandlerMap: MessageHandlerMap

  init(): void {
    this.#tryOneTimeInit()
  }

  addMessageHandler(messageType: string, messageHandler: (content: Record<string, unknown>) => Promise<unknown>): void {
    BaseController.#messageHandlerMap.add(messageType, messageHandler)
  }

  #tryOneTimeInit(): void {
    if (!BaseController.#oneTimeInitiated) {
      this.#oneTimeInit()
      BaseController.#oneTimeInitiated = true
    }
  }

  #oneTimeInit(): void {
    this.#initMessageHandlerMap()
    this.#initListener()
  }

  #initMessageHandlerMap(): void {
    BaseController.#messageHandlerMap = new MessageHandlerMap()
  }

  #initListener(): void {
    chrome.runtime.onMessage.addListener(this.#listenerCallback)
  }

  #listenerCallback = (
    message: { type: string; content: Record<string, unknown> },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ): boolean => {
    this.#handleMessage(message, sendResponse)
    return true
  }

  async #handleMessage(
    message: { type: string; content: Record<string, unknown> },
    sendResponse: (response: unknown) => void
  ): Promise<void> {
    const messageHandler = BaseController.#messageHandlerMap.get(message.type)
    const response = await messageHandler!(message.content)
    sendResponse(response)
  }
}
