import type { BasePayload } from '@shared/types/payload/BasePayload'

export interface FileCacheUpdatePayload extends BasePayload {
  cacheKey: string
  files: string[]
}
