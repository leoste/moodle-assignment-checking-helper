import BaseClient from '@shared/communication/client/BaseClient'
import type { WebviewMessage } from '../../../shared/business/types/WebviewMessage'
import { sidebarViewProvider } from '../../foundation/infrastructure/SidebarViewProvider'

export default class WebviewMessageClient extends BaseClient {
  protected send<TResponse>(message: WebviewMessage): Promise<TResponse> {
    return sidebarViewProvider.post(message) as Promise<TResponse>
  }
}
