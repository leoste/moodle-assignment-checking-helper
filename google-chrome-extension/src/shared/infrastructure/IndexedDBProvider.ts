import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { logger } from '@shared/reporting/logger'
import type { IndexedDBSchema } from '../types/StorageSchema'

const DB_NAME = 'moodle-helper'
const DB_VERSION = 1
const STORE_NAME = 'kv'

// Every context (service worker, popup) has its own instance and its own connection.
class IndexedDBProvider extends BaseInfrastructure {
  #connection: Promise<IDBDatabase> | null = null

  async get<K extends keyof IndexedDBSchema>(key: K): Promise<IndexedDBSchema[K] | undefined> {
    return this.#run('readonly', store => store.get(key))
  }

  async put<K extends keyof IndexedDBSchema>(key: K, value: IndexedDBSchema[K]): Promise<void> {
    await this.#run('readwrite', store => store.put(value, key))
  }

  async delete(key: keyof IndexedDBSchema): Promise<void> {
    await this.#run('readwrite', store => store.delete(key))
  }

  override close(): void {
    const connection = this.#connection
    if (!connection) return
    this.#connection = null
    // A connection that failed to open was already logged in #open.
    connection.then(db => {
      db.close()
      logger.info(this, 'connection closed')
    }, () => {})
  }

  async #run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    this.#connection ??= this.#open()
    const db = await this.#connection
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode)
      const request = action(tx.objectStore(STORE_NAME))
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = () => reject(tx.error)
    })
  }

  #open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME)
      }
      request.onsuccess = () => {
        const db = request.result
        // Another context wants to upgrade the database: let it, the next call reopens.
        db.onversionchange = () => this.close()
        logger.info(this, 'connection opened')
        resolve(db)
      }
      request.onerror = () => {
        logger.error(this, 'connection could not be opened', request.error)
        this.#connection = null
        reject(request.error)
      }
    })
  }
}

export const indexedDBProvider = new IndexedDBProvider()
