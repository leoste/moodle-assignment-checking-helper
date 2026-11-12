import BaseMessageGenerator from '@shared/generator/BaseMessageGenerator'
import type { VsCodeMessage } from '@shared/types/VsCodeMessage'
import type { VsCodeMessagePayloads } from '@shared/types/VsCodeMessagePayloads'

export default abstract class VsCodeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TChannel extends keyof VsCodeMessagePayloads>(
    channel: TChannel,
    payload: VsCodeMessagePayloads[TChannel],
  ): VsCodeMessage<VsCodeMessagePayloads[TChannel]> {
    return { channel, content: payload }
  }
}
