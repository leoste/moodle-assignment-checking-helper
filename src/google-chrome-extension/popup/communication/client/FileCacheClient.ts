import ChromeMessageClient from '../../../shared/communication/client/ChromeMessageClient'
import { fileCacheChromeMessageGenerator } from '../../../shared/foundation/object/FileCacheChromeMessageGenerator'
import type { FileSourceStatus } from '../../../shared/business/types/FileSourceStatus'
import type { FileCacheKey } from '../../../shared/business/types/StorageSchema'
import type { CachedFile } from '../../../shared/business/types/CachedFile'

class FileCacheClient extends ChromeMessageClient {
  async getFileSources(): Promise<FileSourceStatus[]> {
    return this.send<FileSourceStatus[]>(fileCacheChromeMessageGenerator.getFileSourcesMessage())
  }

  async updateCache(cacheKey: FileCacheKey, files: CachedFile[]): Promise<void> {
    await this.send(fileCacheChromeMessageGenerator.getUpdateCacheMessage(cacheKey, files))
  }
}

export const fileCacheClient = new FileCacheClient()
