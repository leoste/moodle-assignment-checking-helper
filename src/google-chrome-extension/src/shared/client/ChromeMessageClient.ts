import type { ChromeMessage } from '../types/ChromeMessage'
import BaseClient from '@shared/client/BaseClient'
import { logger } from '@shared/reporting/logger'

export default class ChromeMessageClient extends BaseClient {

    protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
      logger.info(this, `sent ${message.type}`, message.content)
      return chrome.runtime.sendMessage(message) as Promise<TResponse>
    }

    // Sends to the content scripts of all tabs. Tabs without a content script listening for messages reject, which is expected.
    protected async sendToTabs(message: ChromeMessage): Promise<void> {
      logger.info(this, `sent ${message.type} to tabs`, message.content)
      const tabs = await chrome.tabs.query({})
      await Promise.all(tabs.map(async tab => {
        if (tab.id === undefined) return
        await chrome.tabs.sendMessage(tab.id, message).catch(() => {})
      }))
    }

    // Sends to the content script of the tab the lecturer is looking at.
    // False when no content script there listens for messages, e.g. when the page was open before the extension was installed.
    protected async sendToActiveTab(message: ChromeMessage): Promise<boolean> {
      logger.info(this, `sent ${message.type} to the active tab`, message.content)
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id === undefined) return false
      try {
        await chrome.tabs.sendMessage(tab.id, message)
        return true
      } catch {
        return false
      }
    }
}
