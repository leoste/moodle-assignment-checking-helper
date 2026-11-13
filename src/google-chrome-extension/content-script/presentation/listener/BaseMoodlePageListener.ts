import Initialisable from '@shared/foundation/object/Initialisable'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import executeOnPageReady from '../manager/executeOnPageReady'
import type MoodlePageManager from '../manager/MoodlePageManager'
import type BasePresenter from '@shared/presentation/presenter/BasePresenter'

export default abstract class BaseMoodlePageListener<TPageManager extends MoodlePageManager> extends Initialisable {
  #presenter: BasePresenter | undefined

  protected override onInit(): undefined {
    executeOnPageReady(() => {
      logAnnouncer.announceLog(this, `page ready: ${location.href}`)
      void this.loadPage()
    })
  }

  // Replaces the previous page load's presenter, if there is one, with a new one.
  // Runs when the page is ready, and when the lecturer reloads the panel from the popup, skipping the page ready detection.
  async loadPage(): Promise<void> {
    if (this.#presenter) {
      await this.#presenter.stop()
      logAnnouncer.announceLog(this.#presenter, 'stopped')
    }

    this.#presenter = this.createPresenter(this.createPageManager())
    logAnnouncer.announceLog(this.#presenter, 'starting')
    await this.#presenter.start()
    logAnnouncer.announceLog(this.#presenter, 'started')
  }

  protected abstract createPageManager(): TPageManager

  protected abstract createPresenter(pageManager: TPageManager): BasePresenter
}
