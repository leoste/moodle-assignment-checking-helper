import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import ChromeMessageHandlerMap from '../object/ChromeMessageHandlerMap'
import ChromeRequestTracker from '../object/ChromeRequestTracker'
import type { ChromeMessageHandler } from '../types/ChromeMessageHandler'
import type { ChromeMessage, ChromePortRequest, ChromePortResponder, ChromePortResponse } from '../types/ChromeMessage'
import isChromePortResponse from '../util/isChromePortResponse'
import { MESSAGE_PORT_NAME } from '../constants/messages'

// The panel's or the popup's end of the port to the service worker. Messages go both ways, and every request is answered.
// When Chrome stops the idle service worker, the port closes with it. The port is opened again only by the next
// message, otherwise it would keep waking the service worker up.
class ChromePortProvider extends BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
  readonly #requests = new ChromeRequestTracker()
  #port: chrome.runtime.Port | undefined
  #lostHandler: () => void = () => {}

  constructor() {
    super(new ChromeMessageHandlerMap())
  }

  post(message: ChromeMessage): Promise<unknown> {
    return this.#requests.post(message, async request => (this.#port ?? this.#connect()).postMessage(request))
  }

  // A port's own disconnect() doesn't fire its onDisconnect, so the lost handler doesn't run.
  disconnect(): void {
    this.#port?.disconnect()
    this.#port = undefined
  }

  // Runs when the service worker's end closes the port.
  setLostHandler(handler: () => void): void {
    this.#lostHandler = handler
  }

  protected respondHandled(responder: ChromePortResponder, response: unknown): void {
    this.#respond(responder, response)
  }

  protected respondUnhandled(responder: ChromePortResponder): void {
    this.#respond(responder, undefined)
  }

  protected respondError(responder: ChromePortResponder): void {
    this.#respond(responder, undefined)
  }

  #connect(): chrome.runtime.Port {
    const port = chrome.runtime.connect({ name: MESSAGE_PORT_NAME })
    port.onMessage.addListener((message: ChromePortRequest | ChromePortResponse) => {
      if (isChromePortResponse(message)) this.#requests.handleResponse(message)
      else void this.dispatch(message.type, message.content, { port, id: message.id })
    })
    port.onDisconnect.addListener(() => {
      if (this.#port !== port) return
      this.#port = undefined
      this.#requests.cancelAll()
      this.#lostHandler()
    })
    this.#port = port
    return port
  }

  #respond({ port, id }: ChromePortResponder, content: unknown): void {
    const response: ChromePortResponse = { id, content }
    try {
      port.postMessage(response)
    } catch {
      // The port closed while the request was handled, so there's no one to answer.
    }
  }
}

export const chromePortProvider = new ChromePortProvider()
