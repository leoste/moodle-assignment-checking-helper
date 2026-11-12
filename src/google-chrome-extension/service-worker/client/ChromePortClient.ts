import BaseClient from '@shared/client/BaseClient'
import { announcer } from '@shared/announcer/Announcer'
import type { ChromeMessage } from '../../shared/types/ChromeMessage'
import { chromePortReceiver } from '../infrastructure/ChromePortReceiver'

// Sends the service worker's messages over the ports, to every open panel and popup.
export default class ChromePortClient extends BaseClient {
  protected async sendToAll(message: ChromeMessage): Promise<void> {
    announcer.announceLog(this, `sent ${message.type} to all ports`, message.content)
    await chromePortReceiver.postToAll(message)
  }
}
