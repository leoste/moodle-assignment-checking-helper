import BaseReceiver from './BaseReceiver'
import type { MessageHandler } from '../../business/types/MessageHandler'
import type { BasePayload } from '../../business/types/BasePayload'

export default abstract class BaseMessageReceiver<THandler extends MessageHandler, TResponder> extends BaseReceiver<BasePayload, THandler, TResponder> {}
