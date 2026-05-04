import BaseController from '@shared/controller/BaseController'
import ChromeMessageHandlerMap from '../../shared/object/ChromeMessageHandlerMap'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'

export default class ChromeExtensionMessageController extends BaseController {

  static #messageHandlerMap: ChromeMessageHandlerMap

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initListener()
  }

  addMessageHandler(messageType: string, messageHandler: ChromeMessageHandler): void {
    ChromeExtensionMessageController.#messageHandlerMap.add(messageType, messageHandler)
  }

  #initMessageHandlerMap(): void {
    ChromeExtensionMessageController.#messageHandlerMap = new ChromeMessageHandlerMap()
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
    const messageHandler = ChromeExtensionMessageController.#messageHandlerMap.get(message.type)
    if (!messageHandler) {
      console.error(`[ChromeWebSocketController] No handler registered for message type: "${message.type}"`)
      sendResponse(undefined)
      return
    }
    const response = await messageHandler(message.content)
    sendResponse(response)
  }
}
