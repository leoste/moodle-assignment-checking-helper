import IndexedDBRepository from './IndexedDBRepository'

class FileCacheRepository extends IndexedDBRepository {
  async get(cacheKey: string): Promise<string[]> {
    return (await this.getValue<string[]>(cacheKey)) ?? []
  }

  async set(cacheKey: string, contents: string[]): Promise<void> {
    await this.setValue(cacheKey, contents)
  }
}

export const fileCacheRepository = new FileCacheRepository()
