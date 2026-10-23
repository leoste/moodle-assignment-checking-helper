import BaseService from '@shared/service/BaseService'
import FileCacheRepository from '../repository/FileCacheRepository'
import type { FileSourceStatus } from '../../shared/types/FileSourceStatus'
import type { FileCacheKey } from '../../shared/types/StorageSchema'

class FileCacheService extends BaseService {
  async getFileSources(): Promise<FileSourceStatus[]> {
    return Promise.all(FileCacheRepository.getRegistry().map(async r => ({
      ...r.fileSourceInfo,
      updatedAt: await r.getUpdatedAt(),
    })))
  }

  async updateCache(cacheKey: FileCacheKey, files: string[]): Promise<void> {
    const repo = FileCacheRepository.getRegistry().find(r => r.fileSourceInfo.cacheKey === cacheKey)
    await repo?.setFileContents(files)
  }
}

export const fileCacheService = new FileCacheService()
