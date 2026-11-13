import BaseClient from '@shared/communication/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { vsCodeWindowConnectionProvider } from '../../foundation/infrastructure/VsCodeWindowConnectionProvider'

// Sends VS Code messages to the window that receives the students.
export default class VsCodeMessageClient extends BaseClient {
  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    logAnnouncer.announceLog(this, `sent ${message.channel}`, message.content)
    return vsCodeWindowConnectionProvider.post(message)
  }
}
