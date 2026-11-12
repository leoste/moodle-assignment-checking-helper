import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../business/types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../../business/types/ChromeMessagePayloads'
import { chromeMessageReceiver, type SendResponse } from '../../foundation/infrastructure/ChromeMessageReceiver'

export default class ChromeMessageController extends BaseMessageController<ChromeMessageHandler, SendResponse, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, SendResponse> {
    return chromeMessageReceiver
  }
}
