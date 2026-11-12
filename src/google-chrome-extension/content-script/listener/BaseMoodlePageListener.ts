import Initialisable from '@shared/Initialisable'
import { announcer } from '@shared/announcer/Announcer'
import executeOnPageReady from '../manager/executeOnPageReady'
import type MoodlePageManager from '../manager/MoodlePageManager'
import type BasePresenter from '@shared/presenter/BasePresenter'

export default abstract class BaseMoodlePageListener<TPageManager extends MoodlePageManager> extends Initialisable {
  #presenter: BasePresenter | undefined

  protected override onInit(): undefined {
    executeOnPageReady(() => {
      announcer.announceLog(this, `page ready: ${location.href}`)
      void this.loadPage()
    })
  }

  // Replaces the previous page load's presenter, if there is one, with a new one.
  // Runs when the page is ready, and when the lecturer reloads the panel from the popup, skipping the page ready detection.
  async loadPage(): Promise<void> {
    if (this.#presenter) {
      await this.#presenter.stop()
      announcer.announceLog(this.#presenter, 'stopped')
    }

    this.#presenter = this.createPresenter(this.createPageManager())
    announcer.announceLog(this.#presenter, 'starting')
    await this.#presenter.start()
    announcer.announceLog(this.#presenter, 'started')
  }

  protected abstract createPageManager(): TPageManager

  protected abstract createPresenter(pageManager: TPageManager): BasePresenter
}
