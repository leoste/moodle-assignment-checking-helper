import BaseClient from '@shared/client/BaseClient'
import { webSocketService } from '../service/WebSocketService'

class ChromeVsCodeClient extends BaseClient {
  async postMessage(channel: string, content: unknown): Promise<unknown> {
    return webSocketService.post(channel, content)
  }
}

export const chromeVsCodeClient = new ChromeVsCodeClient()
