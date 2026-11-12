import type { ChromeMessage } from '../types/ChromeMessage'
import BaseClient from '@shared/client/BaseClient'
import { announcer } from '@shared/announcer/Announcer'
import { chromePortProvider } from '../infrastructure/ChromePortProvider'

// Sends the panel's or the popup's messages to the service worker over the port.
export default class ChromePortClient extends BaseClient {
  protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
    announcer.announceLog(this, `sent ${message.type} over the port`, message.content)
    return chromePortProvider.post(message) as Promise<TResponse>
  }

  protected disconnect(): void {
    chromePortProvider.disconnect()
  }
}
