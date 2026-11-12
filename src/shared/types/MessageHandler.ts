import type { Handler } from './Handler'
import type { BasePayload } from './payload/BasePayload'

export interface MessageHandler<TPayload extends BasePayload = BasePayload> extends Handler<TPayload> {}
