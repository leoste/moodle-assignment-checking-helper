import AsyncInitialisable from '../../../../shared/AsyncInitialisable'
import executeOnPageReady from '../pagemanager/executeOnPageReady'

export default class BaseMoodlePageListener extends AsyncInitialisable {
  protected override async onInit(): Promise<void> {
    executeOnPageReady(this.onPageLoad.bind(this))
  }

  async onPageLoad() {}
}
