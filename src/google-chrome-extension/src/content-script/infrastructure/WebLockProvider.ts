import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'

// Web Locks are shared by all tabs of the same site, and the browser frees a lock when the page holding it goes away.
class WebLockProvider extends BaseInfrastructure {
  readonly #requests = new Map<string, Promise<boolean>>()

  // True when this page holds the lock, false when another page does.
  // Once acquired, the lock stays with this page for as long as the page lives.
  async acquire(name: string): Promise<boolean> {
    const request = this.#requests.get(name) ?? this.#request(name)
    this.#requests.set(name, request)
    const acquired = await request
    if (!acquired) this.#requests.delete(name)
    return acquired
  }

  #request(name: string): Promise<boolean> {
    return new Promise(resolve => {
      void navigator.locks.request(name, { ifAvailable: true }, lock => {
        resolve(lock !== null)
        // Never settles, so the browser keeps the lock until the page goes away.
        return lock ? new Promise<never>(() => {}) : undefined
      })
    })
  }
}

export const webLockProvider = new WebLockProvider()
