import BaseRepository from './BaseRepository'

const DB_NAME = 'moodle-helper'
const DB_VERSION = 1
const STORE_NAME = 'kv'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export default abstract class IndexedDBRepository extends BaseRepository {
  protected async getValue<T>(key: string): Promise<T | undefined> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const request = tx.objectStore(STORE_NAME).get(key)
      request.onsuccess = () => resolve(request.result as T | undefined)
      request.onerror = () => reject(request.error)
    })
  }

  protected async setValue<T>(key: string, value: T): Promise<void> {
    await this.#write(store => store.put(value, key))
  }

  protected async removeValue(key: string): Promise<void> {
    await this.#write(store => store.delete(key))
  }

  async #write(action: (store: IDBObjectStore) => void): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      action(tx.objectStore(STORE_NAME))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}
