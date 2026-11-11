import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import { logger } from '@shared/reporting/logger'
import { vsCodeConnectionProvider } from '../infrastructure/VsCodeConnectionProvider'

export default class VsCodeMessageClient extends BaseClient {

  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    logger.info(this, `sent ${message.channel}`, message.content)
    return vsCodeConnectionProvider.post(message)
  }
}
