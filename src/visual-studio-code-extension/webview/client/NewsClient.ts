import WebviewMessageClient from './WebviewMessageClient'
import { newsWebviewMessageGenerator } from '../../shared/generator/NewsWebviewMessageGenerator'
import type { News } from '@shared/types/News'
import type { ReporterClient } from '@shared/types/ReporterClient'

// Reaches the background's reporter.
class NewsClient extends WebviewMessageClient implements ReporterClient {
  // Empty when the background couldn't answer.
  async subscribe(): Promise<News[]> {
    return (await this.send<News[] | undefined>(newsWebviewMessageGenerator.getSubscribeMessage())) ?? []
  }

  // The sidebar's page follows the background's reporter for as long as the page lives.
  unsubscribe(): void {}
}

export const newsClient = new NewsClient()
