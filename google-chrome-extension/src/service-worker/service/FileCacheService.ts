import BaseService from '@shared/service/BaseService'
import FileCacheRepository from '../repository/FileCacheRepository'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'

class FileCacheService extends BaseService {
  getFileSources(): FileSourceInfo[] {
    return FileCacheRepository.getRegistry().map(r => r.fileSourceInfo)
  }

  async updateCache(cacheKey: string, files: string[]): Promise<void> {
    const repo = FileCacheRepository.getRegistry().find(r => r.fileSourceInfo.cacheKey === cacheKey)
    await repo?.setFileContents(files)
  }
}

export const fileCacheService = new FileCacheService()
