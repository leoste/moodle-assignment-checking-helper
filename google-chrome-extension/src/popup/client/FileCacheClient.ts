import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { fileCacheChromeMessageGenerator } from '../../shared/generator/FileCacheChromeMessageGenerator'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'

class FileCacheClient extends ChromeMessageClient {
  async getFileSources(): Promise<FileSourceInfo[]> {
    return this.send<FileSourceInfo[]>(fileCacheChromeMessageGenerator.getFileSourcesMessage())
  }

  async updateCache(cacheKey: string, files: string[]): Promise<void> {
    await this.send(fileCacheChromeMessageGenerator.getUpdateCacheMessage(cacheKey, files))
  }
}

export const fileCacheClient = new FileCacheClient()
