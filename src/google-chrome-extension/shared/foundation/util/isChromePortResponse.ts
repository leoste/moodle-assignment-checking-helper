import type { ChromePortRequest, ChromePortResponse } from '../../business/types/ChromeMessage'

// Both ends send their requests and their responses over the same port. Only a request has a type.
export default function isChromePortResponse(message: ChromePortRequest | ChromePortResponse): message is ChromePortResponse {
  return !('type' in message)
}
