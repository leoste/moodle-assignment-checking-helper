import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import ChromeMessageHandlerMap from '../../shared/object/ChromeMessageHandlerMap'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import type { ChromeMessage } from '../../shared/types/ChromeMessage'

export type SendResponse = (response: unknown) => void

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
