import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../../shared/types/ChromeMessagePayloads'
import { chromeMessageReceiver, type SendResponse } from '../infrastructure/ChromeMessageReceiver'

export default class ChromeMessageController extends BaseMessageController<ChromeMessageHandler, SendResponse, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, SendResponse> {
    return chromeMessageReceiver
  }
}
