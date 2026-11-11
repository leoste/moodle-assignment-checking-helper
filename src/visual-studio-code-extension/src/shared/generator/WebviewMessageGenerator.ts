import BaseMessageGenerator from '@shared/generator/BaseMessageGenerator'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { WebviewMessagePayloads } from '../types/WebviewMessagePayloads'

export default abstract class WebviewMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TType extends keyof WebviewMessagePayloads>(
    type: TType,
    payload: WebviewMessagePayloads[TType],
  ): WebviewMessage<WebviewMessagePayloads[TType]> {
    return { type, content: payload }
  }
}
