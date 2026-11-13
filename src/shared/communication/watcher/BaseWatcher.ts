import type BaseReporter from '../reporter/BaseReporter'
import type { News } from '../../business/types/News'
import type { WatcherHook } from '../../business/types/WatcherHook'

// Watches the reporters it chose and gives what it saw to whoever subscribed to its hooks. Watches only while
// something is subscribed.
export default abstract class BaseWatcher<T> {
  readonly #hooks = new Set<WatcherHook<T>>()

  protected abstract getReporters(): readonly BaseReporter[]

  abstract watch(news: News): void

  abstract brief(briefing: readonly News[]): void

  subscribe(hook: WatcherHook<T>): void {
    const watching = this.isWatching()
    this.#hooks.add(hook)
    if (!watching) this.getReporters().forEach(reporter => reporter.subscribe(this))
  }

  unsubscribe(hook: WatcherHook<T>): void {
    if (!this.#hooks.delete(hook) || this.isWatching()) return
    this.getReporters().forEach(reporter => reporter.unsubscribe(this))
    this.onStopped()
  }

  protected isWatching(): boolean {
    return this.#hooks.size > 0
  }

  protected onStopped(): void {}

  protected callHooks(value: T): void {
    [...this.#hooks].forEach(hook => hook(value))
  }
}
