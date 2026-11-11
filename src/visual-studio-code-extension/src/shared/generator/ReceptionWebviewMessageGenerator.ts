import WebviewMessageGenerator from './WebviewMessageGenerator'
import { RECEPTION_SHOW, RECEPTION_TAKE_OVER } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { ReceptionPayload } from '../types/payload/ReceptionPayload'
import type { BasePayload } from '@shared/types/payload/BasePayload'

class ReceptionWebviewMessageGenerator extends WebviewMessageGenerator {
  getShowReceptionMessage(receiving: boolean): WebviewMessage<ReceptionPayload> {
    return this.makeMessage(RECEPTION_SHOW, { receiving })
  }

  getTakeOverMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(RECEPTION_TAKE_OVER, {})
  }
}

export const receptionWebviewMessageGenerator = new ReceptionWebviewMessageGenerator()
