import BaseController from './BaseController'
import type BaseMessageReceiver from '../infrastructure/BaseMessageReceiver'
import type { MessageHandler } from '../types/MessageHandler'
import type { BasePayload } from '../types/payload/BasePayload'

export default abstract class BaseMessageController<THandler extends MessageHandler, TResponder> extends BaseController {
  protected abstract getReceiver(): BaseMessageReceiver<THandler, TResponder>

  protected addMessageHandler<TPayload extends BasePayload>(key: string, handler: MessageHandler<TPayload>): void {
    this.getReceiver().addHandler(key, handler)
  }
}
