import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import ChromeExtensionMessageClient from '../../shared/client/ChromeExtensionMessageClient'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'

class FileCacheClient extends ChromeExtensionMessageClient {
  async getFileSources(): Promise<FileSourceInfo[]> {
    return chrome.runtime.sendMessage(this.makeMessage(FILES_GET_SOURCES, {}))
  }

  async updateCache(cacheKey: string, files: string[]): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(FILES_UPDATE_CACHE, { cacheKey, files }))
  }
}

export const fileCacheClient = new FileCacheClient()
