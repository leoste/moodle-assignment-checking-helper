import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import { announcer } from '@shared/announcer/Announcer'
import { vsCodeConnectionProvider } from '../infrastructure/VsCodeConnectionProvider'

export default class VsCodeMessageClient extends BaseClient {

  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    announcer.announceLog(this, `sent ${message.channel}`, message.content)
    return vsCodeConnectionProvider.post(message)
  }
}
