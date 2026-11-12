import ChromePortClient from './ChromePortClient'
import { newsChromeMessageGenerator } from '../../foundation/generator/NewsChromeMessageGenerator'
import type { News } from '@shared/business/types/News'
import type { ReporterClient } from '@shared/business/types/ReporterClient'

// Reaches the service worker's reporter.
class NewsClient extends ChromePortClient implements ReporterClient {
  // Empty when the service worker couldn't answer.
  async subscribe(): Promise<News[]> {
    return (await this.send<News[] | undefined>(newsChromeMessageGenerator.getSubscribeMessage())) ?? []
  }

  unsubscribe(): void {
    this.disconnect()
  }
}

export const newsClient = new NewsClient()
