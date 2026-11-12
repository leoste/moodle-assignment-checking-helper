import type * as vscode from 'vscode'
import WritableRepository from '@shared/repository/WritableRepository'
import type { Settings } from '../shared/types/Settings'
import { settingsProvider } from '../infrastructure/SettingsProvider'

class SettingsRepository extends WritableRepository<Settings> {
  async getSettings(): Promise<Settings> {
    // An unset setting has its default from package.json.
    return { openSubDirectories: (await this.getValue('openSubDirectories'))! }
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    for (const key of Object.keys(settings) as (keyof Settings)[]) {
      await this.setValue(key, settings[key]!)
    }
  }

  onDidChange(listener: () => void): vscode.Disposable {
    return settingsProvider.onDidChange(listener)
  }

  protected async getValue<K extends keyof Settings>(key: K): Promise<Settings[K] | undefined> {
    return settingsProvider.get(key)
  }

  protected setValue<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
    return settingsProvider.update(key, value)
  }

  protected removeValue(key: keyof Settings): Promise<void> {
    return settingsProvider.remove(key)
  }
}

export const settingsRepository = new SettingsRepository()
