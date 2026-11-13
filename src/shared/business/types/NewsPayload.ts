import type { BasePayload } from './BasePayload'
import type { AnnouncedNews } from './AnnouncedNews'

export interface NewsPayload extends BasePayload, AnnouncedNews {}
