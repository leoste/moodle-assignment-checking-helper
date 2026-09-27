import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { logger } from '@shared/logging/logger'
import { vsCodeConnectionProvider } from '../infrastructure/VsCodeConnectionProvider'

export default class VsCodeMessageClient extends BaseClient {

  protected async send(message: VsCodeMessage): Promise<VsCodeResponseStatus> {
    logger.info(this, `sent ${message.channel}`, message.content)
    return vsCodeConnectionProvider.post(message)
  }
}
