import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../business/types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../../business/types/ChromeMessagePayloads'
import type { ChromePortResponder } from '../../business/types/ChromeMessage'
import { chromePortProvider } from '../../foundation/infrastructure/ChromePortProvider'

// Handles the messages that the service worker sends to the panel or the popup over the port.
export default class ChromePortController extends BaseMessageController<ChromeMessageHandler, ChromePortResponder, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
    return chromePortProvider
  }
}
