import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../types/ChromeMessagePayloads'
import type { ChromePortResponder } from '../types/ChromeMessage'
import { chromePortProvider } from '../infrastructure/ChromePortProvider'

// Handles the messages that the service worker sends to the panel or the popup over the port.
export default class ChromePortController extends BaseMessageController<ChromeMessageHandler, ChromePortResponder, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
    return chromePortProvider
  }
}
