import Initialisable from '@shared/Initialisable'
import type { Status } from '@shared/types/Status'
import SidebarPresenter from '../presenter/SidebarPresenter'
import type { Settings } from '../../shared/types/Settings'

// Starts the sidebar's page: creates its presenter and passes the extension's messages on to it.
class SidebarListener extends Initialisable {
  #presenter: SidebarPresenter | undefined

  protected override onInit(): undefined {
    this.#presenter = new SidebarPresenter()
    void this.#presenter.start()
  }

  showSettings(settings: Settings): void {
    this.#presenter?.showSettings(settings)
  }

  showStatuses(statuses: readonly Status[]): void {
    this.#presenter?.showStatuses(statuses)
  }

  showReception(receiving: boolean): void {
    this.#presenter?.showReception(receiving)
  }
}

export const sidebarListener = new SidebarListener()
