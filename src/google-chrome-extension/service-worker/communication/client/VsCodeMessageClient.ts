import BaseClient from '@shared/communication/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import { announcer } from '@shared/communication/announcer/Announcer'
import { vsCodeConnectionProvider } from '../../foundation/infrastructure/VsCodeConnectionProvider'

export default class VsCodeMessageClient extends BaseClient {

  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    announcer.announceLog(this, `sent ${message.channel}`, message.content)
    return vsCodeConnectionProvider.post(message)
  }
}
