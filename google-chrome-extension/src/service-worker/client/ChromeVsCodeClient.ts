import BaseClient from '@shared/client/BaseClient'
import type { WebSocketResponseStatus } from '@shared/types/WebSocketProtocol'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import { vsCodeConnectionProvider } from '../provider/VsCodeConnectionProvider'

class ChromeVsCodeClient extends BaseClient {
  async postMessage(channel: string, content: BasePayload): Promise<WebSocketResponseStatus> {
    return vsCodeConnectionProvider.post(channel, content)
  }
}

export const chromeVsCodeClient = new ChromeVsCodeClient()
