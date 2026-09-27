import BaseController from './BaseController'
import type BaseMessageReceiver from '../infrastructure/BaseMessageReceiver'
import type { MessageHandler } from '../types/MessageHandler'
import type { BasePayload } from '../types/payload/BasePayload'

export default abstract class BaseMessageController<
  THandler extends MessageHandler,
  TResponder,
  TPayloads extends Record<string, BasePayload>,
> extends BaseController {
  protected abstract getReceiver(): BaseMessageReceiver<THandler, TResponder>

  protected addMessageHandler<TKey extends keyof TPayloads & string>(
    key: TKey,
    handler: MessageHandler<TPayloads[TKey]>,
  ): void {
    this.getReceiver().addHandler(key, handler)
  }
}
