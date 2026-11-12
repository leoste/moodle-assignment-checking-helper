import BasePresenter from '@shared/presenter/BasePresenter'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import { receptionWatcher } from '../watcher/ReceptionWatcher'
import { settingsWatcher } from '../watcher/SettingsWatcher'
import SidebarRenderer from '../renderer/SidebarRenderer'
import { settingsClient } from '../client/SettingsClient'
import { receptionClient } from '../client/ReceptionClient'
import { newsClient } from '../client/NewsClient'

export default class SidebarPresenter extends BasePresenter {
  #renderer: SidebarRenderer | undefined

  async start(): Promise<void> {
    this.#renderer = new SidebarRenderer({
      onOpenSubDirectoriesChanged: this.#onOpenSubDirectoriesChanged,
      onTakeOver: this.#onTakeOver,
    })
    await this.#renderer.render()
    statusLineWatcher.setStatusLine(this.#renderer.statusLine)
    receptionWatcher.setSidebar(this.#renderer)
    await this.refreshSettings()
    await Promise.all([
      statusLineWatcher.follow(newsClient),
      receptionWatcher.follow(newsClient),
      settingsWatcher.follow(newsClient),
    ])
  }

  async refreshSettings(): Promise<void> {
    const settings = await settingsClient.getSettings()
    if (settings) this.#renderer?.setSettings(settings)
  }

  #onOpenSubDirectoriesChanged = (openSubDirectories: boolean): void => {
    void settingsClient.changeSettings({ openSubDirectories })
  }

  #onTakeOver = (): void => {
    void receptionClient.takeOver()
  }
}
