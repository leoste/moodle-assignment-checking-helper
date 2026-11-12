import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import WebviewRequestTracker from '../../shared/object/WebviewRequestTracker'
import type { WebviewMessage, WebviewRequest, WebviewResponse } from '../../shared/types/WebviewMessage'
import isWebviewResponse from '../../shared/util/isWebviewResponse'

// Sends the page's requests to the extension and takes in their answers. Also sends the page's answers to the
// extension's requests, which WebviewMessageReceiver takes in.
class VsCodeApiProvider extends BaseInfrastructure {
  readonly #api = acquireVsCodeApi()
  readonly #requests = new WebviewRequestTracker()

  protected override onInit(): undefined {
    window.addEventListener('message', (event: MessageEvent<WebviewRequest | WebviewResponse>) => {
      if (isWebviewResponse(event.data)) this.#requests.handleResponse(event.data)
    })
  }

  post(message: WebviewMessage): Promise<unknown> {
    return this.#requests.post(message, async request => this.#api.postMessage(request))
  }

  respond(requestId: string, content: unknown): void {
    const response: WebviewResponse = { id: requestId, content }
    this.#api.postMessage(response)
  }
}

export const vsCodeApiProvider = new VsCodeApiProvider()
