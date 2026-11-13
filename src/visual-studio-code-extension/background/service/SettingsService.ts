import BaseService from '@shared/service/BaseService'
import { settingsAnnouncer } from '@shared/communication/announcer/SettingsAnnouncer'
import { settingsRepository } from '../repository/SettingsRepository'
import type { Settings } from '../../shared/business/types/Settings'

class SettingsService extends BaseService {
  // Whoever shows the settings asks for them again, also after they were changed in VS Code's Settings editor.
  protected override onInit(): undefined {
    settingsRepository.onDidChange(() => settingsAnnouncer.announceSettingsUpdated())
  }

  async getSettings(): Promise<Settings> {
    return settingsRepository.getSettings()
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    await settingsRepository.updateSettings(settings)
  }
}

export const settingsService = new SettingsService()
