import BaseRequestTracker from '@shared/foundation/object/BaseRequestTracker'
import type { ChromeMessage, ChromePortRequest, ChromePortResponse } from '../../business/types/ChromeMessage'

// Pairs the requests sent over the port between the service worker and a page with their answers.
// Like a message over chrome.runtime, a request that couldn't be answered gets undefined.
export default class ChromeRequestTracker extends BaseRequestTracker<ChromeMessage, unknown> {
  // `send` puts the request on the port and rejects if it can't.
  post(message: ChromeMessage, send: (request: ChromePortRequest) => Promise<void>): Promise<unknown> {
    return this.track(message, send)
  }

  handleResponse(response: ChromePortResponse): void {
    this.complete(response.id, response.content)
  }

  protected getKey(message: ChromeMessage): string {
    return message.type
  }

  protected getNoAnswer(): unknown {
    return undefined
  }

  protected getUnreachableAnswer(): unknown {
    return undefined
  }
}
