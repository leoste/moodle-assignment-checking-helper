import BaseController from '@shared/controller/BaseController'
import ChromeMessageHandlerMap from '../../shared/object/ChromeMessageHandlerMap'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'

/**
 * Base class for controllers handling chrome.runtime messages, and at the same time the
 * singleton dispatcher for them: the handler map and the listener are static and shared
 * by all subclasses (set up once via onOneTimeInit).
 */
export default class ChromeMessageController extends BaseController {

  static #messageHandlerMap: ChromeMessageHandlerMap

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initListener()
  }

  addMessageHandler(messageType: string, messageHandler: ChromeMessageHandler): void {
    ChromeMessageController.#messageHandlerMap.add(messageType, messageHandler)
  }

  #initMessageHandlerMap(): void {
    ChromeMessageController.#messageHandlerMap = new ChromeMessageHandlerMap()
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
    const messageHandler = ChromeMessageController.#messageHandlerMap.get(message.type)
    if (!messageHandler) {
      console.error(`[ChromeMessageController] No handler registered for message type: "${message.type}"`)
      sendResponse(undefined)
      return
    }
    const response = await messageHandler(message.content)
    sendResponse(response)
  }
}
