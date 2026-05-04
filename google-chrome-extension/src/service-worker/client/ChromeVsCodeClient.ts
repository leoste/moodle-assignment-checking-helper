import BaseClient from '@shared/client/BaseClient'
import { vsCodeConnectionProvider } from '../provider/VsCodeConnectionProvider'

class ChromeVsCodeClient extends BaseClient {
  async postMessage(channel: string, content: unknown): Promise<unknown> {
    return vsCodeConnectionProvider.post(channel, content)
  }
}

export const chromeVsCodeClient = new ChromeVsCodeClient()
