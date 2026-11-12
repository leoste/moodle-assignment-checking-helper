import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import WebviewMessageHandlerMap from '../../shared/object/WebviewMessageHandlerMap'
import type { WebviewMessageHandler } from '../../shared/types/WebviewMessageHandler'
import type { WebviewRequest, WebviewResponse } from '../../shared/types/WebviewMessage'
import isWebviewResponse from '../../shared/util/isWebviewResponse'
import { vsCodeApiProvider } from './VsCodeApiProvider'

// Receives the extension's requests in the sidebar's page and answers them through VsCodeApiProvider.
class WebviewMessageReceiver extends BaseMessageReceiver<WebviewMessageHandler, string> {
  constructor() {
    super(new WebviewMessageHandlerMap())
  }

  protected override onInit(): undefined {
    window.addEventListener('message', (event: MessageEvent<WebviewRequest | WebviewResponse>) => {
      if (isWebviewResponse(event.data)) return
      void this.dispatch(event.data.type, event.data.content, event.data.id)
    })
  }

  protected respondHandled(requestId: string, response: unknown): void {
    vsCodeApiProvider.respond(requestId, response)
  }

  protected respondUnhandled(requestId: string): void {
    vsCodeApiProvider.respond(requestId, undefined)
  }

  protected respondError(requestId: string): void {
    vsCodeApiProvider.respond(requestId, undefined)
  }
}

export const webviewMessageReceiver = new WebviewMessageReceiver()
