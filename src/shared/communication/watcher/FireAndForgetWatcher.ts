import BaseWatcher from './BaseWatcher'
import type { News } from '../../business/types/News'

// Gives every piece of news it notices to its hooks and keeps nothing.
export default abstract class FireAndForgetWatcher<T> extends BaseWatcher<T> {
  // Undefined when the news is of no interest to the watcher.
  protected abstract notice(news: News): T | undefined

  watch(news: News): void {
    const noticed = this.notice(news)
    if (noticed !== undefined) this.callHooks(noticed)
  }

  // The news that is still true is old news to a watcher that doesn't remember.
  brief(_briefing: readonly News[]): void {}
}
