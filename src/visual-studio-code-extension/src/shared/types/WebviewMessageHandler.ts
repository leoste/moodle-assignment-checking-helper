import type { MessageHandler } from '@shared/types/MessageHandler'
import type { BasePayload } from '@shared/types/BasePayload'

export interface WebviewMessageHandler<TPayload extends BasePayload = BasePayload> extends MessageHandler<TPayload> {}
