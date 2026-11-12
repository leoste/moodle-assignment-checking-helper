import type { MessageHandler } from '@shared/business/types/MessageHandler'
import type { BasePayload } from '@shared/business/types/BasePayload'

export interface VsCodeMessageHandler<TPayload extends BasePayload = BasePayload> extends MessageHandler<TPayload> {}
