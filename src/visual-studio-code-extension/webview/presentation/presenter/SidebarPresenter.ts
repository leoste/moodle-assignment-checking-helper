import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import { statusWatcher } from '@shared/communication/watcher/StatusWatcher'
import { receptionWatcher } from '@shared/communication/watcher/ReceptionWatcher'
import { settingsWatcher } from '@shared/communication/watcher/SettingsWatcher'
import type { Status } from '@shared/business/types/Status'
import SidebarRenderer from '../renderer/SidebarRenderer'
import { settingsClient } from '../../communication/client/SettingsClient'
import { receptionClient } from '../../communication/client/ReceptionClient'

export default class SidebarPresenter extends BasePresenter {
  #renderer: SidebarRenderer | undefined

  async start(): Promise<void> {
    this.#renderer = new SidebarRenderer({
      onOpenSubDirectoriesChanged: this.#onOpenSubDirectoriesChanged,
      onTakeOver: this.#onTakeOver,
    })
    await this.#renderer.render()
    await this.#refreshSettings()
    statusWatcher.subscribe(this.#showStatuses)
    receptionWatcher.subscribe(this.#showReceiving)
    settingsWatcher.subscribe(this.#onSettingsUpdated)
  }

  async #refreshSettings(): Promise<void> {
    const settings = await settingsClient.getSettings()
    if (settings) this.#renderer?.setSettings(settings)
  }

  #showStatuses = (statuses: readonly Status[]): void => {
    this.#renderer?.statusLine.show(statuses)
  }

  #showReceiving = (receiving: boolean): void => {
    this.#renderer?.setReceiving(receiving)
  }

  #onSettingsUpdated = (): void => {
    void this.#refreshSettings()
  }

  #onOpenSubDirectoriesChanged = (openSubDirectories: boolean): void => {
    void settingsClient.changeSettings({ openSubDirectories })
  }

  #onTakeOver = (): void => {
    void receptionClient.takeOver()
  }
}
