import AsyncInitialisable from '../../../../shared/AsyncInitialisable'
import executeOnPageReady from '../pagemanager/executeOnPageReady'
import type MoodlePage from '../pagemanager/MoodlePage'

export default abstract class BaseMoodlePageListener<TPage extends MoodlePage> extends AsyncInitialisable {
  protected override async onInit(): Promise<void> {
    executeOnPageReady(() => this.onPageLoad(this.createPage()))
  }

  protected abstract createPage(): TPage

  protected abstract onPageLoad(page: TPage): Promise<void>
}
