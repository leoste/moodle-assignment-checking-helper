import WebviewMessageGenerator from './WebviewMessageGenerator'
import { SETTINGS_CHANGE, SETTINGS_GET } from '../../foundation/constants/webview-messages'
import type { WebviewMessage } from '../../business/types/WebviewMessage'
import type { Settings } from '../../business/types/Settings'
import type { BasePayload } from '@shared/business/types/BasePayload'
import type { SettingsChangePayload } from '../../business/types/SettingsChangePayload'

class SettingsWebviewMessageGenerator extends WebviewMessageGenerator {
  getGetSettingsMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(SETTINGS_GET, {})
  }

  getChangeSettingsMessage(settings: Partial<Settings>): WebviewMessage<SettingsChangePayload> {
    return this.makeMessage(SETTINGS_CHANGE, { settings })
  }
}

export const settingsWebviewMessageGenerator = new SettingsWebviewMessageGenerator()
