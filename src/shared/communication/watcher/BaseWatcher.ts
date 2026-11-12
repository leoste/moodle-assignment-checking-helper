import type { News } from '../../business/types/News'
import type { ReporterClient } from '../../business/types/ReporterClient'

// Shows news to the lecturer, or to whoever reads the log. A watcher gets all the news of the reporters it follows
// and decides itself which kinds it watches.
export default abstract class BaseWatcher {
  abstract watch(news: News): void

  // Follows another context's reporter too.
  async follow(reporter: ReporterClient): Promise<void> {
    const briefing = await reporter.subscribe()
    briefing.forEach(news => this.watch(news))
  }

  unfollow(reporter: ReporterClient): void {
    reporter.unsubscribe()
  }
}
