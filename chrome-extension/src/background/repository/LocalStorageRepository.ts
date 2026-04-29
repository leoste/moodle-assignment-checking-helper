import BaseRepository from "./BaseRepository"

export default class LocalStorageRepository extends BaseRepository {
  protected async setValue(key: string, value: unknown): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  }

  protected async getValue<T>(key: string): Promise<T | undefined> {
    const result = await chrome.storage.local.get(key)
    return result[key] as T | undefined
  }

  protected async removeValue(key: string): Promise<void> {
    await chrome.storage.local.remove(key)
  }
}
