import BaseService from '@shared/service/BaseService'
import { settingsRepository } from '../repository/SettingsRepository'
import { settingsClient } from '../client/SettingsClient'
import type { Settings } from '../shared/types/Settings'

class SettingsService extends BaseService {
  // The sidebar shows the settings, also after they were changed in VS Code's Settings editor.
  protected override onInit(): undefined {
    settingsRepository.onDidChange(() => void this.#showSettings())
    void this.#showSettings()
  }

  async getSettings(): Promise<Settings> {
    return settingsRepository.getSettings()
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    await settingsRepository.updateSettings(settings)
  }

  async #showSettings(): Promise<void> {
    await settingsClient.showSettings(await settingsRepository.getSettings())
  }
}

export const settingsService = new SettingsService()
