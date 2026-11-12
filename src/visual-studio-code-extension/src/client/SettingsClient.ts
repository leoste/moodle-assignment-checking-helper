import WebviewMessageClient from './WebviewMessageClient'
import { settingsWebviewMessageGenerator } from '../shared/generator/SettingsWebviewMessageGenerator'
import type { Settings } from '../shared/types/Settings'

class SettingsClient extends WebviewMessageClient {
  async showSettings(settings: Settings): Promise<void> {
    await this.send(settingsWebviewMessageGenerator.getShowSettingsMessage(settings))
  }
}

export const settingsClient = new SettingsClient()
