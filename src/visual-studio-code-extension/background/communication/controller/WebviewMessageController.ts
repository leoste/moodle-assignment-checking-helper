import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { WebviewMessagePayloads } from '../../../shared/business/types/WebviewMessagePayloads'
import type { WebviewMessageHandler } from '../../../shared/business/types/WebviewMessageHandler'
import { sidebarViewProvider } from '../../foundation/infrastructure/SidebarViewProvider'

export default class WebviewMessageController extends BaseMessageController<WebviewMessageHandler, string, WebviewMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<WebviewMessageHandler, string> {
    return sidebarViewProvider
  }
}
