import type { BasePayload } from './payload/BasePayload'

export interface MessageHandler<TPayload extends BasePayload = BasePayload> {
  (content: TPayload): Promise<unknown>
}
