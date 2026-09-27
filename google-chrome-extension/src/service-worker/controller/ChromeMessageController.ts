import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import { chromeMessageReceiver, type SendResponse } from '../infrastructure/ChromeMessageReceiver'

export default class ChromeMessageController extends BaseMessageController<ChromeMessageHandler, SendResponse> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, SendResponse> {
    return chromeMessageReceiver
  }
}
