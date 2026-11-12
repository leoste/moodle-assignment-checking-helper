import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import type { ChromeMessage } from '../../business/types/ChromeMessage'

// Every context that sends Chrome messages (content script, popup) has its own instance.
class ChromeMessageProvider extends BaseInfrastructure {
  send<TResponse>(message: ChromeMessage): Promise<TResponse> {
    return chrome.runtime.sendMessage(message) as Promise<TResponse>
  }

  // Tabs without a content script listening for messages reject, which is expected.
  async sendToTabs(message: ChromeMessage): Promise<void> {
    const tabs = await chrome.tabs.query({})
    await Promise.all(tabs.map(async tab => {
      if (tab.id === undefined) return
      await chrome.tabs.sendMessage(tab.id, message).catch(() => {})
    }))
  }

  async sendToActiveTab(message: ChromeMessage): Promise<boolean> {
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

export const chromeMessageProvider = new ChromeMessageProvider()
