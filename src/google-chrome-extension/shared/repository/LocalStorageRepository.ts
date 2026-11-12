import WritableRepository from '@shared/repository/WritableRepository'
import { chromeStorageProvider } from '../foundation/infrastructure/ChromeStorageProvider'
import type { ChromeStorageSchema } from '../business/types/StorageSchema'

export default abstract class LocalStorageRepository extends WritableRepository<ChromeStorageSchema> {
  protected getValue<K extends keyof ChromeStorageSchema>(key: K): Promise<ChromeStorageSchema[K] | undefined> {
    return chromeStorageProvider.get(key)
  }

  protected setValue<K extends keyof ChromeStorageSchema>(key: K, value: ChromeStorageSchema[K]): Promise<void> {
    return chromeStorageProvider.set(key, value)
  }

  protected removeValue(key: keyof ChromeStorageSchema): Promise<void> {
    return chromeStorageProvider.remove(key)
  }
}
