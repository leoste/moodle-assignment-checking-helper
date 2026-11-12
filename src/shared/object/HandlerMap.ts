import type { Handler } from '../types/Handler'
import { announcer } from '../announcer/Announcer'

export default class HandlerMap<T extends Handler<never>> {
  readonly #handlers = new Map<string, T>()

  add(key: string, handler: T): void {
    if (this.#handlers.has(key)) {
      announcer.announceLogError(this, `handler already registered for ${key}, keeping the first one`)
      return
    }
    this.#handlers.set(key, handler)
  }

  get(key: string): T | undefined {
    return this.#handlers.get(key)
  }
}
