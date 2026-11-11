import type { BasePayload } from '@shared/types/payload/BasePayload'

// A message between the extension and the sidebar's page (webview.postMessage).
export interface WebviewMessage<TPayload extends BasePayload = BasePayload> {
  type: string
  content: TPayload
}
