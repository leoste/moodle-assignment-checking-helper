import ChromePortClient from './ChromePortClient'
import { newsChromeMessageGenerator } from '../../shared/generator/NewsChromeMessageGenerator'
import type { News } from '@shared/types/News'
import type { WatcherClient } from '@shared/types/WatcherClient'

// Reaches the watchers of the panels and the popup that follow the service worker's reporter: only they open a port.
class NewsClient extends ChromePortClient implements WatcherClient {
  async report(news: News): Promise<void> {
    await this.sendToAll(newsChromeMessageGenerator.getReportMessage(news))
  }
}

export const newsClient = new NewsClient()
