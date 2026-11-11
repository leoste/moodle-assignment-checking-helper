import BaseClient from '@shared/client/BaseClient'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import { logger } from '@shared/reporting/logger'
import { vsCodeWindowConnectionProvider } from '../infrastructure/VsCodeWindowConnectionProvider'

// Sends VS Code messages to the window that receives the students.
export default class VsCodeMessageClient extends BaseClient {
  protected async send(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    logger.info(this, `sent ${message.channel}`, message.content)
    return vsCodeWindowConnectionProvider.post(message)
  }
}
