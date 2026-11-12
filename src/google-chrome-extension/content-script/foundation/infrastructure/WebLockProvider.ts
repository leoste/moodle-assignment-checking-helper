import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { announcer } from '@shared/communication/announcer/Announcer'

// Web Locks are shared by all tabs of the same site, and the browser frees a lock when the page holding it goes away.
class WebLockProvider extends BaseInfrastructure {
  readonly #requests = new Map<string, Promise<boolean>>()
  readonly #lostHandlers = new Map<string, () => void>()

  // True when this page holds the lock, false when another page does.
  // Once acquired, the lock stays with this page for as long as the page lives, unless another page steals it.
  async acquire(name: string): Promise<boolean> {
    const request = this.#requests.get(name) ?? this.#request(name, { ifAvailable: true })
    this.#requests.set(name, request)
    const acquired = await request
    if (!acquired) this.#requests.delete(name)
    return acquired
  }

  // Takes the lock over from the page holding it, which is told through its lost handler.
  async steal(name: string): Promise<void> {
    const request = this.#request(name, { steal: true })
    this.#requests.set(name, request)
    await request
  }

  // Runs when another page steals the lock from this page.
  setLostHandler(name: string, handler: () => void): void {
    this.#lostHandlers.set(name, handler)
  }

  #request(name: string, options: LockOptions): Promise<boolean> {
    let granted!: (acquired: boolean) => void
    const request = new Promise<boolean>(resolve => {
      granted = resolve
    })
    navigator.locks.request(name, options, lock => {
      granted(lock !== null)
      // Never settles, so the browser keeps the lock until the page goes away or another page steals it.
      return lock ? new Promise<never>(() => {}) : undefined
    }).catch(() => {
      // A held lock's request ends with an error only when the lock is stolen.
      // This page stealing it from itself replaced the request already, so only another page's steal counts.
      if (this.#requests.get(name) !== request) return
      this.#requests.delete(name)
      announcer.announceLog(this, `lock ${name} was taken over by another page`)
      this.#lostHandlers.get(name)?.()
    })
    return request
  }
}

export const webLockProvider = new WebLockProvider()
