import BaseRequestTracker from '@shared/object/BaseRequestTracker'
import type { WebviewMessage, WebviewRequest, WebviewResponse } from '../types/WebviewMessage'

// Pairs the requests sent between the extension and the sidebar's page with their answers.
// Like a Chrome message, a request that couldn't be answered gets undefined.
export default class WebviewRequestTracker extends BaseRequestTracker<WebviewMessage, unknown> {
  // `send` puts the request on its way and rejects if it can't.
  post(message: WebviewMessage, send: (request: WebviewRequest) => Promise<void>): Promise<unknown> {
    return this.track(message, send)
  }

  handleResponse(response: WebviewResponse): void {
    this.complete(response.id, response.content)
  }

  protected getKey(message: WebviewMessage): string {
    return message.type
  }

  protected getNoAnswer(): unknown {
    return undefined
  }

  protected getUnreachableAnswer(): unknown {
    return undefined
  }
}
