import type { BasePayload } from '@shared/types/BasePayload'

// A message between the extension and the sidebar's page (webview.postMessage).
export interface WebviewMessage<TPayload extends BasePayload = BasePayload> {
  type: string
  content: TPayload
}

// The id pairs a request with its response and is added when the message is sent.
export interface WebviewRequest<TPayload extends BasePayload = BasePayload> extends WebviewMessage<TPayload> {
  id: string
}

// What the request's handler returned, or undefined when the request couldn't be handled.
export interface WebviewResponse {
  id: string
  content: unknown
  // Only a request has a type: that tells the two apart.
  type?: never
}
