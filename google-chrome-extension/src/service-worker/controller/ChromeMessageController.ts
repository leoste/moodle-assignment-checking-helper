import BaseMessageController from '@shared/controller/BaseMessageController'
import ChromeMessageHandlerMap from '../../shared/object/ChromeMessageHandlerMap'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import type { ChromeMessage } from '../../shared/types/ChromeMessage'

type SendResponse = (response: unknown) => void

/**
 * Base class for controllers handling chrome.runtime messages, and at the same time the
 * singleton dispatcher for them: the handler map and the listener are static and shared
 * by all subclasses (set up once via onOneTimeInit).
 */
export default class ChromeMessageController extends BaseMessageController<ChromeMessageHandler, SendResponse> {

  static #messageHandlerMap: ChromeMessageHandlerMap

  protected override async onOneTimeInit(): Promise<void> {
    this.#initMessageHandlerMap()
    this.#initListener()
  }

  protected getHandlerMap(): ChromeMessageHandlerMap {
    return ChromeMessageController.#messageHandlerMap
  }

  protected respondHandled(sendResponse: SendResponse, response: unknown): void {
    sendResponse(response)
  }

  protected respondUnhandled(sendResponse: SendResponse): void {
    sendResponse(undefined)
  }

  protected respondError(sendResponse: SendResponse): void {
    sendResponse(undefined)
  }

  #initMessageHandlerMap(): void {
    ChromeMessageController.#messageHandlerMap = new ChromeMessageHandlerMap()
  }

  #initListener(): void {
    chrome.runtime.onMessage.addListener(this.#listenerCallback)
  }

  #listenerCallback = (
    message: ChromeMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: SendResponse
  ): boolean => {
    this.dispatch(message.type, message.content as Record<string, unknown>, sendResponse)
    return true
  }
}
