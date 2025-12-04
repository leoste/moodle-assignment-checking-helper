export default class LocalStorageRepository {
  async setValue(key, value) {
    await chrome.storage.local.set({ [key]: value })    
  }

  async getValue(key) {
    const value = await chrome.storage.local.get(key)
    return value
  }
}