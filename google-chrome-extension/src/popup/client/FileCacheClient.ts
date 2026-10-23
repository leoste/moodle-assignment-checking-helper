import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { fileCacheChromeMessageGenerator } from '../../shared/generator/FileCacheChromeMessageGenerator'
import type { FileSourceStatus } from '../../shared/types/FileSourceStatus'
import type { FileCacheKey } from '../../shared/types/StorageSchema'

class FileCacheClient extends ChromeMessageClient {
  async getFileSources(): Promise<FileSourceStatus[]> {
    return this.send<FileSourceStatus[]>(fileCacheChromeMessageGenerator.getFileSourcesMessage())
  }

  async updateCache(cacheKey: FileCacheKey, files: string[]): Promise<void> {
    await this.send(fileCacheChromeMessageGenerator.getUpdateCacheMessage(cacheKey, files))
  }
}

export const fileCacheClient = new FileCacheClient()
