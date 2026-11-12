import type { ChromeMessage } from '../../business/types/ChromeMessage'
import BaseClient from '@shared/communication/client/BaseClient'
import { announcer } from '@shared/communication/announcer/Announcer'
import { chromeMessageProvider } from '../../foundation/infrastructure/ChromeMessageProvider'

export default class ChromeMessageClient extends BaseClient {

    protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
      announcer.announceLog(this, `sent ${message.type}`, message.content)
      return chromeMessageProvider.send<TResponse>(message)
    }

    // Sends to the content scripts of all tabs.
    protected async sendToTabs(message: ChromeMessage): Promise<void> {
      announcer.announceLog(this, `sent ${message.type} to tabs`, message.content)
      await chromeMessageProvider.sendToTabs(message)
    }

    // Sends to the content script of the tab the lecturer is looking at.
    // False when no content script there listens for messages, e.g. when the page was open before the extension was installed.
    protected async sendToActiveTab(message: ChromeMessage): Promise<boolean> {
      announcer.announceLog(this, `sent ${message.type} to the active tab`, message.content)
      return chromeMessageProvider.sendToActiveTab(message)
    }
}
