import Initialisable from '../../../../shared/Initialisable'
import { logger } from '@shared/logging/logger'
import executeOnPageReady from '../pagemanager/executeOnPageReady'
import type MoodlePage from '../pagemanager/MoodlePage'
import type BasePresenter from '../../shared/presenter/BasePresenter'

export default abstract class BaseMoodlePageListener<TPage extends MoodlePage> extends Initialisable {
  #presenter: BasePresenter | undefined

  protected override onInit(): undefined {
    executeOnPageReady(() => this.#onPageReady())
  }

  protected abstract createPage(): TPage

  protected abstract createPresenter(page: TPage): BasePresenter

  async #onPageReady(): Promise<void> {
    logger.info(this, `page ready: ${location.href}`)

    if (this.#presenter) {
      await this.#presenter.stop()
      logger.info(this.#presenter, 'stopped')
    }

    this.#presenter = this.createPresenter(this.createPage())
    logger.info(this.#presenter, 'starting')
    await this.#presenter.start()
    logger.info(this.#presenter, 'started')
  }
}
