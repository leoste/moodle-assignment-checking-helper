import Initialisable from '../../../../shared/Initialisable'
import executeOnPageReady from '../pagemanager/executeOnPageReady'
import type MoodlePage from '../pagemanager/MoodlePage'

export default abstract class BaseMoodlePageListener<TPage extends MoodlePage> extends Initialisable {
  protected override onInit(): undefined {
    executeOnPageReady(() => this.onPageLoad(this.createPage()))
  }

  protected abstract createPage(): TPage

  protected abstract onPageLoad(page: TPage): Promise<void>
}
