import BasePresenter from '@shared/presenter/BasePresenter'
import type { Status } from '@shared/types/Status'
import SidebarRenderer from '../renderer/SidebarRenderer'
import { settingsClient } from '../client/SettingsClient'
import type { Settings } from '../../shared/types/Settings'

// Unlike other presenters, this one is a singleton: the sidebar's page is loaded once per run of its bundle,
// and the controller has to reach its presenter to pass the extension's messages on.
class SidebarPresenter extends BasePresenter {
  #renderer: SidebarRenderer | undefined

  async start(): Promise<void> {
    this.#renderer = new SidebarRenderer(document.body, {
      onOpenSubDirectoriesChanged: this.#onOpenSubDirectoriesChanged,
    })
    await this.#renderer.render()
  }

  showSettings(settings: Settings): void {
    this.#renderer?.setSettings(settings)
  }

  showStatuses(statuses: readonly Status[]): void {
    this.#renderer?.statusLine.show(statuses)
  }

  #onOpenSubDirectoriesChanged = (openSubDirectories: boolean): void => {
    settingsClient.changeSettings({ openSubDirectories })
  }
}

export const sidebarPresenter = new SidebarPresenter()
