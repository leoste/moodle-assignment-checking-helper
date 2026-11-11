import BaseRepository from '@shared/repository/BaseRepository'
import type { ChromeStorageSchema } from '../types/StorageSchema'

export default abstract class LocalStorageRepository extends BaseRepository<ChromeStorageSchema> {
  protected async getValue<K extends keyof ChromeStorageSchema>(key: K): Promise<ChromeStorageSchema[K] | undefined> {
    const result = await chrome.storage.local.get(key)
    return result[key] as ChromeStorageSchema[K] | undefined
  }

  protected async setValue<K extends keyof ChromeStorageSchema>(key: K, value: ChromeStorageSchema[K]): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  }

  protected async removeValue(key: keyof ChromeStorageSchema): Promise<void> {
    await chrome.storage.local.remove(key)
  }
}
