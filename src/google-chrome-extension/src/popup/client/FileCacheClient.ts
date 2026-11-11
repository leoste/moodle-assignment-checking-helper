import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { fileCacheChromeMessageGenerator } from '../../shared/generator/FileCacheChromeMessageGenerator'
import type { FileSourceStatus } from '../../shared/types/FileSourceStatus'
import type { FileCacheKey } from '../../shared/types/StorageSchema'
import type { CachedFile } from '../../shared/types/CachedFile'

class FileCacheClient extends ChromeMessageClient {
  async getFileSources(): Promise<FileSourceStatus[]> {
    return this.send<FileSourceStatus[]>(fileCacheChromeMessageGenerator.getFileSourcesMessage())
  }

  async updateCache(cacheKey: FileCacheKey, files: CachedFile[]): Promise<void> {
    await this.send(fileCacheChromeMessageGenerator.getUpdateCacheMessage(cacheKey, files))
  }
}

export const fileCacheClient = new FileCacheClient()
