import type { WebviewRequest, WebviewResponse } from '../types/WebviewMessage'

// Both sides send their requests and their responses over the same lane. Only a request has a type.
export default function isWebviewResponse(message: WebviewRequest | WebviewResponse): message is WebviewResponse {
  return !('type' in message)
}
