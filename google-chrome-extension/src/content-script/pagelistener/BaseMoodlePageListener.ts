import Initialisable from '../../../../shared/Initialisable'
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
    await this.#presenter?.stop()
    this.#presenter = this.createPresenter(this.createPage())
    await this.#presenter.start()
  }
}
