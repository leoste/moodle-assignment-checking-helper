import IndexedDBRepository from './IndexedDBRepository'

class FileHandleRepository extends IndexedDBRepository {
  async get<T>(key: string): Promise<T | undefined> {
    return this.getValue<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.setValue(key, value)
  }
}

export const fileHandleRepository = new FileHandleRepository()
