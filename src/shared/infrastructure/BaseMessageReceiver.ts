import BaseReceiver from './BaseReceiver'
import type { MessageHandler } from '../types/MessageHandler'
import type { BasePayload } from '../types/payload/BasePayload'

export default abstract class BaseMessageReceiver<THandler extends MessageHandler, TResponder> extends BaseReceiver<BasePayload, THandler, TResponder> {}
