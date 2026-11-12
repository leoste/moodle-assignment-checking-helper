import BaseClient from '@shared/client/BaseClient'
import { announcer } from '@shared/announcer/Announcer'
import type { WebviewMessage } from '../../shared/types/WebviewMessage'
import { vsCodeApiProvider } from '../infrastructure/VsCodeApiProvider'

export default class WebviewMessageClient extends BaseClient {
  protected async send<TResponse>(message: WebviewMessage): Promise<TResponse> {
    announcer.announceLog(this, `sent ${message.type}`, message.content)
    return vsCodeApiProvider.post(message) as Promise<TResponse>
  }
}
