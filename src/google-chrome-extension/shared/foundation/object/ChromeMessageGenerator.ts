import BaseMessageGenerator from '@shared/foundation/object/BaseMessageGenerator'
import type { ChromeMessage } from '../../business/types/ChromeMessage'
import type { ChromeMessagePayloads } from '../../business/types/ChromeMessagePayloads'

export default abstract class ChromeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TType extends keyof ChromeMessagePayloads>(
    type: TType,
    payload: ChromeMessagePayloads[TType],
  ): ChromeMessage<ChromeMessagePayloads[TType]> {
    return { type, content: payload }
  }
}
