import BaseClient from '@shared/communication/client/BaseClient'
import { announcer } from '@shared/communication/announcer/Announcer'
import type { ChromeMessage } from '../../../shared/business/types/ChromeMessage'
import { chromePortReceiver } from '../../foundation/infrastructure/ChromePortReceiver'

// Sends the service worker's messages over the ports, to every open panel and popup.
export default class ChromePortClient extends BaseClient {
  protected async sendToAll(message: ChromeMessage): Promise<void> {
    announcer.announceLog(this, `sent ${message.type} to all ports`, message.content)
    await chromePortReceiver.postToAll(message)
  }
}
