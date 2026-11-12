import WebviewMessageClient from './WebviewMessageClient'
import { settingsWebviewMessageGenerator } from '../../../shared/foundation/object/SettingsWebviewMessageGenerator'
import type { Settings } from '../../../shared/business/types/Settings'

class SettingsClient extends WebviewMessageClient {
  // Undefined when the extension couldn't answer.
  async getSettings(): Promise<Settings | undefined> {
    return this.send<Settings | undefined>(settingsWebviewMessageGenerator.getGetSettingsMessage())
  }

  async changeSettings(settings: Partial<Settings>): Promise<void> {
    await this.send(settingsWebviewMessageGenerator.getChangeSettingsMessage(settings))
  }
}

export const settingsClient = new SettingsClient()
