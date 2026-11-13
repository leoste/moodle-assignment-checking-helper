import BaseWatcher from './BaseWatcher'
import type { News } from '../../business/types/News'
import type { WatcherHook } from '../../business/types/WatcherHook'

// Remembers the last value of what it watches, also from the briefings, and gives it to a hook as soon as it
// subscribes. Forgets it when nothing is subscribed any more.
export default abstract class RememberingWatcher<T> extends BaseWatcher<T> {
  // False when the news is of no interest to the watcher.
  protected abstract remember(news: News): boolean

  protected abstract recall(): T | undefined

  protected abstract forget(): void

  override subscribe(hook: WatcherHook<T>): void {
    const watching = this.isWatching()
    super.subscribe(hook)
    const value = this.recall()
    if (watching && value !== undefined) hook(value)
  }

  watch(news: News): void {
    if (this.remember(news)) this.#tell()
  }

  brief(briefing: readonly News[]): void {
    let remembered = false
    for (const news of briefing) remembered = this.remember(news) || remembered
    if (remembered) this.#tell()
  }

  protected override onStopped(): void {
    this.forget()
  }

  #tell(): void {
    const value = this.recall()
    if (value !== undefined) this.callHooks(value)
  }
}
