import ChromeMessageGenerator from './ChromeMessageGenerator'
import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../constants/messages'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { FileCacheUpdatePayload } from '../types/payload/FileCacheUpdatePayload'
import type { FileCacheKey } from '../types/StorageSchema'

class FileCacheChromeMessageGenerator extends ChromeMessageGenerator {
  getFileSourcesMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(FILES_GET_SOURCES, {})
  }

  getUpdateCacheMessage(cacheKey: FileCacheKey, files: string[]): ChromeMessage<FileCacheUpdatePayload> {
    return this.makeMessage(FILES_UPDATE_CACHE, { cacheKey, files })
  }
}

export const fileCacheChromeMessageGenerator = new FileCacheChromeMessageGenerator()
