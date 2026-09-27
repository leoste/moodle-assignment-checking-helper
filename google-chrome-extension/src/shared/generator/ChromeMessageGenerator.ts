import BaseMessageGenerator from '@shared/generator/BaseMessageGenerator'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { ChromeMessagePayloads } from '../types/ChromeMessagePayloads'

export default abstract class ChromeMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TType extends keyof ChromeMessagePayloads>(
    type: TType,
    payload: ChromeMessagePayloads[TType],
  ): ChromeMessage<ChromeMessagePayloads[TType]> {
    return { type, content: payload }
  }
}
