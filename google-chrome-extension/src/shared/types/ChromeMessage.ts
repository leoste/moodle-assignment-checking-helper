import type { BasePayload } from '@shared/types/payload/BasePayload'

export interface ChromeMessage<TPayload extends BasePayload = BasePayload> {
  type: string
  content: TPayload
}
