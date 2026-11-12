import WebviewMessageClient from './WebviewMessageClient'
import { settingsWebviewMessageGenerator } from '../../shared/generator/SettingsWebviewMessageGenerator'
import type { Settings } from '../../shared/types/Settings'

class SettingsClient extends WebviewMessageClient {
  async changeSettings(settings: Partial<Settings>): Promise<void> {
    await this.send(settingsWebviewMessageGenerator.getChangeSettingsMessage(settings))
  }
}

export const settingsClient = new SettingsClient()
