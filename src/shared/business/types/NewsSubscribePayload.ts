import type { BasePayload } from './BasePayload'

export interface NewsSubscribePayload extends BasePayload {
  announcers: readonly string[]
}
