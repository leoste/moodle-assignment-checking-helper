import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import type { Settings } from '../../../shared/business/types/Settings'
import { SETTINGS_SECTION } from '../../config'

// The settings are stored by VS Code as the user's settings, so they can be changed in VS Code's Settings editor as well.
class SettingsProvider extends BaseInfrastructure {
  get<K extends keyof Settings>(key: K): Settings[K] | undefined {
    return this.#getConfiguration().get<Settings[K]>(key)
  }

  async update<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
    await this.#getConfiguration().update(key, value, vscode.ConfigurationTarget.Global)
  }

  async remove(key: keyof Settings): Promise<void> {
    await this.#getConfiguration().update(key, undefined, vscode.ConfigurationTarget.Global)
  }

  onDidChange(listener: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(SETTINGS_SECTION)) listener()
    })
  }

  #getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(SETTINGS_SECTION)
  }
}

export const settingsProvider = new SettingsProvider()
