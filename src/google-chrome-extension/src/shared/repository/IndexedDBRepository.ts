import BaseRepository from '@shared/repository/BaseRepository'
import { indexedDBProvider } from '../infrastructure/IndexedDBProvider'
import type { IndexedDBSchema } from '../types/StorageSchema'

export default abstract class IndexedDBRepository extends BaseRepository<IndexedDBSchema> {
  protected getValue<K extends keyof IndexedDBSchema>(key: K): Promise<IndexedDBSchema[K] | undefined> {
    return indexedDBProvider.get(key)
  }

  protected setValue<K extends keyof IndexedDBSchema>(key: K, value: IndexedDBSchema[K]): Promise<void> {
    return indexedDBProvider.put(key, value)
  }

  protected removeValue(key: keyof IndexedDBSchema): Promise<void> {
    return indexedDBProvider.delete(key)
  }
}
