import { newsPool } from '../../foundation/object/NewsPool'
import type { News } from '../../business/types/News'
import type { NewsSource } from '../../business/types/NewsSource'

// The source of news. Whoever has news calls its announcer, which puts the news into the pool for the reporters
// that subscribed to it.
export default abstract class BaseAnnouncer implements NewsSource {
  readonly key: string

  constructor(key: string) {
    this.key = key
    newsPool.addSource(this)
  }

  get staysInPart(): boolean {
    return false
  }

  remember(_stillTrue: readonly News[], _news: News): News[] {
    return []
  }

  protected announce(news: News): void {
    newsPool.put(this, news)
  }
}
