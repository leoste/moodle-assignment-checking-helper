import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import type { ChromeStorageSchema } from '../../business/types/StorageSchema'

class ChromeStorageProvider extends BaseInfrastructure {
  async get<K extends keyof ChromeStorageSchema>(key: K): Promise<ChromeStorageSchema[K] | undefined> {
    const result = await chrome.storage.local.get(key)
    return result[key] as ChromeStorageSchema[K] | undefined
  }

  async set<K extends keyof ChromeStorageSchema>(key: K, value: ChromeStorageSchema[K]): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  }

  async remove(key: keyof ChromeStorageSchema): Promise<void> {
    await chrome.storage.local.remove(key)
  }
}

export const chromeStorageProvider = new ChromeStorageProvider()
