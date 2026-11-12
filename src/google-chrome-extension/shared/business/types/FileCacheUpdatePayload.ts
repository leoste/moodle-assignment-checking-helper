import type { BasePayload } from '@shared/business/types/BasePayload'
import type { CachedFile } from './CachedFile'
import type { FileCacheKey } from './StorageSchema'

export interface FileCacheUpdatePayload extends BasePayload {
  cacheKey: FileCacheKey
  files: CachedFile[]
}
