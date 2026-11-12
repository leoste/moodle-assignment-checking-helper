import Initialisable from '@shared/foundation/object/Initialisable'
import SidebarPresenter from '../presenter/SidebarPresenter'

// Starts the sidebar's page: creates its presenter and passes the news it has to act on to it.
class SidebarPageListener extends Initialisable {
  #presenter: SidebarPresenter | undefined

  protected override onInit(): undefined {
    this.#presenter = new SidebarPresenter()
    void this.#presenter.start()
  }

  async refreshSettings(): Promise<void> {
    await this.#presenter?.refreshSettings()
  }
}

export const sidebarPageListener = new SidebarPageListener()
