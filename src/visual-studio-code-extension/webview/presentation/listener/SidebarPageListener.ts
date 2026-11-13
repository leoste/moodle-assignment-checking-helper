import Initialisable from '@shared/foundation/object/Initialisable'
import SidebarPresenter from '../presenter/SidebarPresenter'

// Starts the sidebar's page: creates its presenter.
class SidebarPageListener extends Initialisable {
  #presenter: SidebarPresenter | undefined

  protected override onInit(): undefined {
    this.#presenter = new SidebarPresenter()
    void this.#presenter.start()
  }
}

export const sidebarPageListener = new SidebarPageListener()
