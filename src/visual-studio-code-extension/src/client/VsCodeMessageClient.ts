import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import { announcer } from '@shared/announcer/Announcer'
import { vsCodeWindowConnectionProvider } from '../infrastructure/VsCodeWindowConnectionProvider'

// Sends VS Code messages to the window that receives the students.
export default class VsCodeMessageClient extends BaseClient {
  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    announcer.announceLog(this, `sent ${message.channel}`, message.content)
    return vsCodeWindowConnectionProvider.post(message)
  }
}
