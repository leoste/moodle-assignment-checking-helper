import ChromeMessageGenerator from './ChromeMessageGenerator'
import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../foundation/constants/messages'
import type { BasePayload } from '@shared/business/types/BasePayload'
import type { ChromeMessage } from '../../business/types/ChromeMessage'
import type { FileCacheUpdatePayload } from '../../business/types/FileCacheUpdatePayload'
import type { FileCacheKey } from '../../business/types/StorageSchema'
import type { CachedFile } from '../../business/types/CachedFile'

class FileCacheChromeMessageGenerator extends ChromeMessageGenerator {
  getFileSourcesMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(FILES_GET_SOURCES, {})
  }

  getUpdateCacheMessage(cacheKey: FileCacheKey, files: CachedFile[]): ChromeMessage<FileCacheUpdatePayload> {
    return this.makeMessage(FILES_UPDATE_CACHE, { cacheKey, files })
  }
}

export const fileCacheChromeMessageGenerator = new FileCacheChromeMessageGenerator()
