import WebviewMessageGenerator from './WebviewMessageGenerator'
import { SETTINGS_CHANGE, SETTINGS_GET } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { Settings } from '../types/Settings'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { SettingsChangePayload } from '../types/payload/SettingsChangePayload'

class SettingsWebviewMessageGenerator extends WebviewMessageGenerator {
  getGetSettingsMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(SETTINGS_GET, {})
  }

  getChangeSettingsMessage(settings: Partial<Settings>): WebviewMessage<SettingsChangePayload> {
    return this.makeMessage(SETTINGS_CHANGE, { settings })
  }
}

export const settingsWebviewMessageGenerator = new SettingsWebviewMessageGenerator()
