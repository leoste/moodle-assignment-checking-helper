import BaseMessageGenerator from '@shared/generator/BaseMessageGenerator'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { ChromeMessage } from '../types/ChromeMessage'

export default abstract class ChromeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TPayload extends BasePayload>(type: string, payload: TPayload): ChromeMessage<TPayload> {
    return { type, content: payload }
  }
}
