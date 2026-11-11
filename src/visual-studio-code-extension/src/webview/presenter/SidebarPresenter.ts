import BasePresenter from '@shared/presenter/BasePresenter'
import type { Status } from '@shared/types/Status'
import SidebarRenderer from '../renderer/SidebarRenderer'
import { settingsClient } from '../client/SettingsClient'
import { sidebarClient } from '../client/SidebarClient'
import { receptionClient } from '../client/ReceptionClient'
import type { Settings } from '../../shared/types/Settings'

export default class SidebarPresenter extends BasePresenter {
  #renderer: SidebarRenderer | undefined

  async start(): Promise<void> {
    this.#renderer = new SidebarRenderer(document.body, {
      onOpenSubDirectoriesChanged: this.#onOpenSubDirectoriesChanged,
      onTakeOver: this.#onTakeOver,
    })
    await this.#renderer.render()
    // The page asks for the current settings and statuses only once it can show them.
    sidebarClient.notifyReady()
  }

  showSettings(settings: Settings): void {
    this.#renderer?.setSettings(settings)
  }

  showStatuses(statuses: readonly Status[]): void {
    this.#renderer?.statusLine.show(statuses)
  }

  showReception(receiving: boolean): void {
    this.#renderer?.setReceiving(receiving)
  }

  #onOpenSubDirectoriesChanged = (openSubDirectories: boolean): void => {
    settingsClient.changeSettings({ openSubDirectories })
  }

  #onTakeOver = (): void => {
    receptionClient.takeOver()
  }
}
