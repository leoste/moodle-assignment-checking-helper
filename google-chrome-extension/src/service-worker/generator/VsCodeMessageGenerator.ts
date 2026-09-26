import BaseMessageGenerator from '@shared/generator/BaseMessageGenerator'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { VsCodeMessage } from '@shared/types/VsCodeMessage'

export default abstract class VsCodeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TPayload extends BasePayload>(channel: string, payload: TPayload): VsCodeMessage<TPayload> {
    return { channel, content: payload }
  }
}
