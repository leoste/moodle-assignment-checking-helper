import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { WebviewMessagePayloads } from '../../../shared/business/types/WebviewMessagePayloads'
import type { WebviewMessageHandler } from '../../../shared/business/types/WebviewMessageHandler'
import { webviewMessageReceiver } from '../../foundation/infrastructure/WebviewMessageReceiver'

export default class WebviewMessageController extends BaseMessageController<WebviewMessageHandler, string, WebviewMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<WebviewMessageHandler, string> {
    return webviewMessageReceiver
  }
}
