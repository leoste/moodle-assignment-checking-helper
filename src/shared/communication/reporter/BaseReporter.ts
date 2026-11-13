import { newsPool } from '../../foundation/object/NewsPool'
import type BaseAnnouncer from '../announcer/BaseAnnouncer'
import type BaseWatcher from '../watcher/BaseWatcher'
import type { AnnouncedNews } from '../../business/types/AnnouncedNews'
import type { NewsSubscriber } from '../../business/types/NewsSubscriber'

type Watching = Pick<BaseWatcher<unknown>, 'watch' | 'brief'>

// Routes the news of the announcers it subscribed to towards the watchers that subscribed to it. Subscribes to its
// announcers only while it has watchers; a new watcher is briefed from the pool.
export default abstract class BaseReporter implements NewsSubscriber {
  readonly #watchers = new Set<Watching>()

  protected abstract getAnnouncers(): readonly BaseAnnouncer[]

  subscribe(watcher: Watching): void {
    if (this.#watchers.has(watcher)) return
    this.#watchers.add(watcher)
    if (this.#watchers.size === 1) newsPool.subscribe(this.getAnnouncers(), this)
    watcher.brief(newsPool.getBriefing(this.getAnnouncers()).map(({ news }) => news))
  }

  unsubscribe(watcher: Watching): void {
    if (!this.#watchers.delete(watcher)) return
    if (this.#watchers.size === 0) newsPool.unsubscribe(this.getAnnouncers(), this)
  }

  report({ news }: AnnouncedNews): void {
    [...this.#watchers].forEach(watcher => watcher.watch(news))
  }

  brief(briefing: readonly AnnouncedNews[]): void {
    const news = briefing.map(announced => announced.news)
    ;[...this.#watchers].forEach(watcher => watcher.brief(news))
  }
}
