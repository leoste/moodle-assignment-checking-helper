import type { BasePayload } from './BasePayload'
import type { News } from './News'

export interface NewsPayload extends BasePayload {
  news: News
}
