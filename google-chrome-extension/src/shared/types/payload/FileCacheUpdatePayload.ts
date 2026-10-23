import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { FileCacheKey } from '../StorageSchema'

export interface FileCacheUpdatePayload extends BasePayload {
  cacheKey: FileCacheKey
  files: string[]
}
