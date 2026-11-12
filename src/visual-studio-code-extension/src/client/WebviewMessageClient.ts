import BaseClient from '@shared/client/BaseClient'
import type { WebviewMessage } from '../shared/types/WebviewMessage'
import { sidebarViewProvider } from '../infrastructure/SidebarViewProvider'

export default class WebviewMessageClient extends BaseClient {
  protected send<TResponse>(message: WebviewMessage): Promise<TResponse> {
    return sidebarViewProvider.post(message) as Promise<TResponse>
  }
}
