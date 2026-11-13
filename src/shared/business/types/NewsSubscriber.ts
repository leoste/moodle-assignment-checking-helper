import type { AnnouncedNews } from './AnnouncedNews'

export interface NewsSubscriber {
  report(announced: AnnouncedNews): void
  brief(briefing: readonly AnnouncedNews[]): void
}
