import BaseClient from '@shared/client/BaseClient'
import { logger } from '@shared/reporting/logger'
import type { WebviewMessage } from '../../shared/types/WebviewMessage'
import { vsCodeApiProvider } from '../infrastructure/VsCodeApiProvider'

export default class WebviewMessageClient extends BaseClient {
  protected send(message: WebviewMessage): void {
    logger.info(this, `sent ${message.type}`, message.content)
    vsCodeApiProvider.postMessage(message)
  }
}
