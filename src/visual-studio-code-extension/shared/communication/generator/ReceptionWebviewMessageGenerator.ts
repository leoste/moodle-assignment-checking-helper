import WebviewMessageGenerator from './WebviewMessageGenerator'
import { RECEPTION_TAKE_OVER } from '../../foundation/constants/webview-messages'
import type { WebviewMessage } from '../../business/types/WebviewMessage'
import type { BasePayload } from '@shared/business/types/BasePayload'

class ReceptionWebviewMessageGenerator extends WebviewMessageGenerator {
  getTakeOverMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(RECEPTION_TAKE_OVER, {})
  }
}

export const receptionWebviewMessageGenerator = new ReceptionWebviewMessageGenerator()
