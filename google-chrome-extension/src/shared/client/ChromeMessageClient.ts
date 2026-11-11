import type { ChromeMessage } from '../types/ChromeMessage'
import BaseClient from '@shared/client/BaseClient'
import { logger } from '@shared/reporting/logger'

export default class ChromeMessageClient extends BaseClient {

    protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
      logger.info(this, `sent ${message.type}`, message.content)
      return chrome.runtime.sendMessage(message) as Promise<TResponse>
    }
}
