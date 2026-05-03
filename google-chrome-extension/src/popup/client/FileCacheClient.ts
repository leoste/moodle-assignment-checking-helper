import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import BaseClient from '../../shared/client/BaseClient'
import type { FileSourceInfo } from '../../shared/types'

class FileCacheClient extends BaseClient {
  async getFileSources(): Promise<FileSourceInfo[]> {
    return chrome.runtime.sendMessage(this.makeMessage(FILES_GET_SOURCES, {}))
  }

  async updateCache(cacheKey: string, files: string[]): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(FILES_UPDATE_CACHE, { cacheKey, files }))
  }
}

export const fileCacheClient = new FileCacheClient()
