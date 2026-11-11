import * as vscode from 'vscode'
import BaseRepository from '@shared/repository/BaseRepository'
import type { Settings } from '../shared/types/Settings'
import { SETTINGS_SECTION } from '../config'

// The settings are stored by VS Code as the user's settings, so they can be changed in VS Code's Settings editor as well.
class SettingsRepository extends BaseRepository<Settings> {
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
    return vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(SETTINGS_SECTION)) listener()
    })
  }

  protected async getValue<K extends keyof Settings>(key: K): Promise<Settings[K] | undefined> {
    return this.#getConfiguration().get<Settings[K]>(key)
  }

  protected async setValue<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
    await this.#getConfiguration().update(key, value, vscode.ConfigurationTarget.Global)
  }

  protected async removeValue(key: keyof Settings): Promise<void> {
    await this.#getConfiguration().update(key, undefined, vscode.ConfigurationTarget.Global)
  }

  #getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(SETTINGS_SECTION)
  }
}

export const settingsRepository = new SettingsRepository()
