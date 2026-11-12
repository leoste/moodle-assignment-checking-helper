import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../../shared/business/types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../../../shared/business/types/ChromeMessagePayloads'
import type { ChromePortResponder } from '../../../shared/business/types/ChromeMessage'
import { chromePortReceiver } from '../../foundation/infrastructure/ChromePortReceiver'

// Handles the messages that the panels and the popup send to the service worker over their ports.
export default class ChromePortController extends BaseMessageController<ChromeMessageHandler, ChromePortResponder, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
    return chromePortReceiver
  }
}
