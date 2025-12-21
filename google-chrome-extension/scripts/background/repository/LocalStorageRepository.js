export default class LocalStorageRepository {
  async setValue(key, value) {
    await chrome.storage.local.set({ [key]: value })    
  }

  async getValue(key) {
    const result = await chrome.storage.local.get(key)
    return result[key]
  }

  async removeValue(key) {
    await chrome.storage.local.remove(key)
  }
}
