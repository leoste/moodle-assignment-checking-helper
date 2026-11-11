import WebviewMessageGenerator from './WebviewMessageGenerator'
import { SETTINGS_CHANGE, SETTINGS_SHOW } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { Settings } from '../types/Settings'
import type { SettingsPayload } from '../types/payload/SettingsPayload'
import type { SettingsChangePayload } from '../types/payload/SettingsChangePayload'

class SettingsWebviewMessageGenerator extends WebviewMessageGenerator {
  getShowSettingsMessage(settings: Settings): WebviewMessage<SettingsPayload> {
    return this.makeMessage(SETTINGS_SHOW, { settings })
  }

  getChangeSettingsMessage(settings: Partial<Settings>): WebviewMessage<SettingsChangePayload> {
    return this.makeMessage(SETTINGS_CHANGE, { settings })
  }
}

export const settingsWebviewMessageGenerator = new SettingsWebviewMessageGenerator()
