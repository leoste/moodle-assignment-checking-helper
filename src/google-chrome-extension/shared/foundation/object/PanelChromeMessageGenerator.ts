import ChromeMessageGenerator from './ChromeMessageGenerator'
import { PANEL_RELOAD } from '../../foundation/constants/messages'
import type { BasePayload } from '@shared/business/types/BasePayload'
import type { ChromeMessage } from '../../business/types/ChromeMessage'

class PanelChromeMessageGenerator extends ChromeMessageGenerator {
  getReloadPanelMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(PANEL_RELOAD, {})
  }
}

export const panelChromeMessageGenerator = new PanelChromeMessageGenerator()
