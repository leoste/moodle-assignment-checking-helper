import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { WebviewMessagePayloads } from '../shared/types/WebviewMessagePayloads'
import type { WebviewMessageHandler } from '../shared/types/WebviewMessageHandler'
import { sidebarViewProvider } from '../infrastructure/SidebarViewProvider'

export default class WebviewMessageController extends BaseMessageController<WebviewMessageHandler, undefined, WebviewMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<WebviewMessageHandler, undefined> {
    return sidebarViewProvider
  }
}
