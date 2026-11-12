import BaseRepository from '@shared/repository/BaseRepository'
import { chromeStorageProvider } from '../infrastructure/ChromeStorageProvider'
import type { ChromeStorageSchema } from '../types/StorageSchema'

export default abstract class LocalStorageRepository extends BaseRepository<ChromeStorageSchema> {
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
