import WebviewMessageClient from './WebviewMessageClient'
import { newsWebviewMessageGenerator } from '../../../shared/foundation/object/NewsWebviewMessageGenerator'
import type { News } from '@shared/business/types/News'
import type { WatcherClient } from '@shared/business/types/WatcherClient'

// Reaches the sidebar's watchers, which follow the background's reporter.
class NewsClient extends WebviewMessageClient implements WatcherClient {
  async report(news: News): Promise<void> {
    await this.send(newsWebviewMessageGenerator.getReportMessage(news))
  }
}

export const newsClient = new NewsClient()
