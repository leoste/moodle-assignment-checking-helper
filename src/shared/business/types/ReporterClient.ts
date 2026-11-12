import type { News } from './News'

// A client that reaches another context's reporter. Subscribing brings the briefing: the news that is still true.
// After that, the reporter's news keeps coming through the context's controllers until unsubscribing.
export interface ReporterClient {
  subscribe(): Promise<News[]>
  unsubscribe(): void
}
