import type { ChromeMessage } from '../types/ChromeMessage'
import BaseClient from '@shared/client/BaseClient'
import { logger } from '@shared/reporting/logger'
import { chromeMessageProvider } from '../infrastructure/ChromeMessageProvider'

export default class ChromeMessageClient extends BaseClient {

    protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
      logger.info(this, `sent ${message.type}`, message.content)
      return chromeMessageProvider.send<TResponse>(message)
    }

    // Sends to the content scripts of all tabs.
    protected async sendToTabs(message: ChromeMessage): Promise<void> {
      logger.info(this, `sent ${message.type} to tabs`, message.content)
      await chromeMessageProvider.sendToTabs(message)
    }

    // Sends to the content script of the tab the lecturer is looking at.
    // False when no content script there listens for messages, e.g. when the page was open before the extension was installed.
    protected async sendToActiveTab(message: ChromeMessage): Promise<boolean> {
      logger.info(this, `sent ${message.type} to the active tab`, message.content)
      return chromeMessageProvider.sendToActiveTab(message)
    }
}
