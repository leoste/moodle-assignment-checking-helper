import WritableRepository from '@shared/repository/WritableRepository'
import { indexedDBProvider } from '../foundation/infrastructure/IndexedDBProvider'
import type { IndexedDBSchema } from '../business/types/StorageSchema'

export default abstract class IndexedDBRepository extends WritableRepository<IndexedDBSchema> {
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
