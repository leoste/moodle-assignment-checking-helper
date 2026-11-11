import WebviewMessageGenerator from './WebviewMessageGenerator'
import { WEBVIEW_READY } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { BasePayload } from '@shared/types/payload/BasePayload'

class SidebarWebviewMessageGenerator extends WebviewMessageGenerator {
  getReadyMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(WEBVIEW_READY, {})
  }
}

export const sidebarWebviewMessageGenerator = new SidebarWebviewMessageGenerator()
