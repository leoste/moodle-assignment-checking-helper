import BaseMessageGenerator from './BaseMessageGenerator'
import type { VsCodeMessage } from '../../business/types/VsCodeMessage'
import type { VsCodeMessagePayloads } from '../../business/types/VsCodeMessagePayloads'

export default abstract class VsCodeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TChannel extends keyof VsCodeMessagePayloads>(
    channel: TChannel,
    payload: VsCodeMessagePayloads[TChannel],
  ): VsCodeMessage<VsCodeMessagePayloads[TChannel]> {
    return { channel, content: payload }
  }
}
