import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { ChromeMessageHandler } from '../../shared/types/ChromeMessageHandler'
import type { ChromeMessagePayloads } from '../../shared/types/ChromeMessagePayloads'
import type { ChromePortResponder } from '../../shared/types/ChromeMessage'
import { chromePortReceiver } from '../infrastructure/ChromePortReceiver'

// Handles the messages that the panels and the popup send to the service worker over their ports.
export default class ChromePortController extends BaseMessageController<ChromeMessageHandler, ChromePortResponder, ChromeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<ChromeMessageHandler, ChromePortResponder> {
    return chromePortReceiver
  }
}
