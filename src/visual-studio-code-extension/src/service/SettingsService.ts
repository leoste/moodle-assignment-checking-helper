import BaseService from '@shared/service/BaseService'
import { announcer } from '@shared/announcer/Announcer'
import { settingsRepository } from '../repository/SettingsRepository'
import type { Settings } from '../shared/types/Settings'

class SettingsService extends BaseService {
  // Whoever shows the settings asks for them again, also after they were changed in VS Code's Settings editor.
  protected override onInit(): undefined {
    settingsRepository.onDidChange(() => announcer.announceSettingsUpdated())
  }

  async getSettings(): Promise<Settings> {
    return settingsRepository.getSettings()
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    await settingsRepository.updateSettings(settings)
  }
}

export const settingsService = new SettingsService()
