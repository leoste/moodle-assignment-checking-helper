import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import WebviewMessageHandlerMap from '../../shared/object/WebviewMessageHandlerMap'
import type { WebviewMessageHandler } from '../../shared/types/WebviewMessageHandler'
import type { WebviewMessage } from '../../shared/types/WebviewMessage'

// Receives the extension's messages in the sidebar's page. They have no responses, so the respond methods do nothing.
class WebviewMessageReceiver extends BaseMessageReceiver<WebviewMessageHandler, undefined> {
  constructor() {
    super(new WebviewMessageHandlerMap())
  }

  protected override onInit(): undefined {
    window.addEventListener('message', (event: MessageEvent<WebviewMessage>) => {
      void this.dispatch(event.data.type, event.data.content, undefined)
    })
  }

  protected respondHandled(): void {}

  protected respondUnhandled(): void {}

  protected respondError(): void {}
}

export const webviewMessageReceiver = new WebviewMessageReceiver()
