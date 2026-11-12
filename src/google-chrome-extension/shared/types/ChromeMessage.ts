import type { BasePayload } from '@shared/types/BasePayload'

export interface ChromeMessage<TPayload extends BasePayload = BasePayload> {
  type: string
  content: TPayload
}

// A message sent over the port between the service worker and a page. Over chrome.runtime, Chrome pairs a message
// with its answer itself; over the port, the id does it and is added when the message is sent.
export interface ChromePortRequest<TPayload extends BasePayload = BasePayload> extends ChromeMessage<TPayload> {
  id: string
}

// What the request's handler returned, or undefined when the request couldn't be handled.
export interface ChromePortResponse {
  id: string
  content: unknown
  // Only a request has a type: that tells the two apart.
  type?: never
}

// A request is answered over the port it came from.
export interface ChromePortResponder {
  port: chrome.runtime.Port
  id: string
}
