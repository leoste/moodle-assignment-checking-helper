import Initialisable from '../../../../shared/Initialisable'
import { logger } from '@shared/reporting/logger'
import executeOnPageReady from '../pagemanager/executeOnPageReady'
import type MoodlePage from '../pagemanager/MoodlePage'
import type BasePresenter from '@shared/presenter/BasePresenter'

export default abstract class BaseMoodlePageListener<TPage extends MoodlePage> extends Initialisable {
  #presenter: BasePresenter | undefined

  protected override onInit(): undefined {
    executeOnPageReady(() => {
      logger.info(this, `page ready: ${location.href}`)
      void this.loadPage()
    })
  }

  // Replaces the previous page load's presenter, if there is one, with a new one.
  // Runs when the page is ready, and when the lecturer reloads the panel from the popup, skipping the page ready detection.
  async loadPage(): Promise<void> {
    if (this.#presenter) {
      await this.#presenter.stop()
      logger.info(this.#presenter, 'stopped')
    }

    this.#presenter = this.createPresenter(this.createPage())
    logger.info(this.#presenter, 'starting')
    await this.#presenter.start()
    logger.info(this.#presenter, 'started')
  }

  protected abstract createPage(): TPage

  protected abstract createPresenter(page: TPage): BasePresenter
}
