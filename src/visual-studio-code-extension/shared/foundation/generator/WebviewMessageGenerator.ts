import BaseMessageGenerator from '@shared/foundation/generator/BaseMessageGenerator'
import type { WebviewMessage } from '../../business/types/WebviewMessage'
import type { WebviewMessagePayloads } from '../../business/types/WebviewMessagePayloads'

export default abstract class WebviewMessageGenerator extends BaseMessageGenerator {
  protected makeMessage<TType extends keyof WebviewMessagePayloads>(
    type: TType,
    payload: WebviewMessagePayloads[TType],
  ): WebviewMessage<WebviewMessagePayloads[TType]> {
    return { type, content: payload }
  }
}
