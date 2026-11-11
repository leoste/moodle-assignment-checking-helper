import ChromeMessageGenerator from './ChromeMessageGenerator'
import { PANEL_RELOAD } from '../constants/messages'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { ChromeMessage } from '../types/ChromeMessage'

class PanelChromeMessageGenerator extends ChromeMessageGenerator {
  getReloadPanelMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(PANEL_RELOAD, {})
  }
}

export const panelChromeMessageGenerator = new PanelChromeMessageGenerator()
