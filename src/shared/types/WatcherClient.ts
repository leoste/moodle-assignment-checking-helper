import type { News } from './News'

// A client that reaches the watchers of other contexts that follow this context's reporter.
export interface WatcherClient {
  report(news: News): Promise<void>
}
