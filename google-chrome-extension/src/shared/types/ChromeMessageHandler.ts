import type { MessageHandler } from '@shared/types/MessageHandler'
import type { BasePayload } from '@shared/types/payload/BasePayload'

export interface ChromeMessageHandler<TPayload extends BasePayload = BasePayload> extends MessageHandler<TPayload> {}
