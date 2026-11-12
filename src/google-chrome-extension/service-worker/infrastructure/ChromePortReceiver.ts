import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import ChromeMessageHandlerMap from '../../shared/object/ChromeMessageHandlerMap'
import ChromeRequestTracker from '../../shared/object/ChromeRequestTracker'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import type { ChromeMessage, ChromePortRequest, ChromePortResponder, ChromePortResponse } from '../../shared/types/ChromeMessage'
import isChromePortResponse from '../../shared/util/isChromePortResponse'
import { MESSAGE_PORT_NAME } from '../../shared/constants/messages'

// The service worker's end of the ports that the panels and the popup open. Messages go both ways, and every request
// is answered. Listens from initialisation on, because the connecting port may be the event that woke the service worker up.
class ChromePortReceiver extends BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
  readonly #ports = new Set<chrome.runtime.Port>()
  readonly #requests = new ChromeRequestTracker()

  constructor() {
    super(new ChromeMessageHandlerMap())
  }

  protected override onInit(): undefined {
    chrome.runtime.onConnect.addListener(port => {
      if (port.name !== MESSAGE_PORT_NAME) return
      this.#ports.add(port)
      port.onMessage.addListener((message: ChromePortRequest | ChromePortResponse) => {
        if (isChromePortResponse(message)) this.#requests.handleResponse(message)
        else void this.dispatch(message.type, message.content, { port, id: message.id })
      })
      port.onDisconnect.addListener(() => this.#ports.delete(port))
    })
  }

  // Sends to every open panel and popup.
  async postToAll(message: ChromeMessage): Promise<void> {
    await Promise.all([...this.#ports].map(port =>
      this.#requests.post(message, async request => port.postMessage(request)),
    ))
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

  #respond({ port, id }: ChromePortResponder, content: unknown): void {
    const response: ChromePortResponse = { id, content }
    try {
      port.postMessage(response)
    } catch {
      // The port closed while the request was handled, so there's no one to answer.
    }
  }
}

export const chromePortReceiver = new ChromePortReceiver()
