import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { vsCodeConnectionProvider } from '../infrastructure/VsCodeConnectionProvider'

export default class VsCodeMessageClient extends BaseClient {

  protected async send(message: VsCodeMessage): Promise<VsCodeResponseStatus> {
    return vsCodeConnectionProvider.post(message)
  }
}
