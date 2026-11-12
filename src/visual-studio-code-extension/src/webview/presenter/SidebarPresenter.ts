import BasePresenter from '@shared/presenter/BasePresenter'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import SidebarRenderer from '../renderer/SidebarRenderer'
import { settingsClient } from '../client/SettingsClient'
import { sidebarClient } from '../client/SidebarClient'
import { receptionClient } from '../client/ReceptionClient'
import { newsClient } from '../client/NewsClient'
import type { Settings } from '../../shared/types/Settings'

export default class SidebarPresenter extends BasePresenter {
  #renderer: SidebarRenderer | undefined

  async start(): Promise<void> {
    this.#renderer = new SidebarRenderer({
      onOpenSubDirectoriesChanged: this.#onOpenSubDirectoriesChanged,
      onTakeOver: this.#onTakeOver,
    })
    await this.#renderer.render()
    statusLineWatcher.setStatusLine(this.#renderer.statusLine)
    // The page asks for the current settings and statuses only once it can show them.
    await sidebarClient.notifyReady()
    await statusLineWatcher.follow(newsClient)
  }

  showSettings(settings: Settings): void {
    this.#renderer?.setSettings(settings)
  }

  showReception(receiving: boolean): void {
    this.#renderer?.setReceiving(receiving)
  }

  #onOpenSubDirectoriesChanged = (openSubDirectories: boolean): void => {
    void settingsClient.changeSettings({ openSubDirectories })
  }

  #onTakeOver = (): void => {
    void receptionClient.takeOver()
  }
}
