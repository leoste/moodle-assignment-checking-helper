import BaseRepository from './BaseRepository'

export default abstract class LocalStorageRepository extends BaseRepository {
  protected async getValue<T>(key: string): Promise<T | undefined> {
    const result = await chrome.storage.local.get(key)
    return result[key] as T | undefined
  }

  protected async setValue<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  }

  protected async removeValue(key: string): Promise<void> {
    await chrome.storage.local.remove(key)
  }
}
