import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import ChromeMessageHandlerMap from '../object/ChromeMessageHandlerMap'
import type { ChromeMessageHandler } from '../types/ChromeMessageHandler'
import type { ChromeMessage } from '../types/ChromeMessage'

export type SendResponse = (response: unknown) => void

// Every context that receives Chrome messages (service worker, content script) has its own instance.
class ChromeMessageReceiver extends BaseMessageReceiver<ChromeMessageHandler, SendResponse> {
  constructor() {
    super(new ChromeMessageHandlerMap())
  }

  protected override onInit(): undefined {
    chrome.runtime.onMessage.addListener(this.#listenerCallback)
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

  #listenerCallback = (
    message: ChromeMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: SendResponse
  ): boolean => {
    this.dispatch(message.type, message.content, sendResponse)
    return true
  }
}

export const chromeMessageReceiver = new ChromeMessageReceiver()
