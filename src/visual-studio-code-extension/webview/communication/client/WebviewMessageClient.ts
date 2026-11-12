import BaseClient from '@shared/communication/client/BaseClient'
import { announcer } from '@shared/communication/announcer/Announcer'
import type { WebviewMessage } from '../../../shared/business/types/WebviewMessage'
import { vsCodeApiProvider } from '../../foundation/infrastructure/VsCodeApiProvider'

export default class WebviewMessageClient extends BaseClient {
  protected async send<TResponse>(message: WebviewMessage): Promise<TResponse> {
    announcer.announceLog(this, `sent ${message.type}`, message.content)
    return vsCodeApiProvider.post(message) as Promise<TResponse>
  }
}
