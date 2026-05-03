import AsyncInitialisable from '../../../../shared/AsyncInitialisable'
import executeOnPageLoad from '../pagemanager/executeOnPageLoad'

export default class BaseMoodlePageListener extends AsyncInitialisable {
  protected override async onInit(): Promise<void> {
    executeOnPageLoad(this.onPageLoad.bind(this))
  }

  async onPageLoad() {}
}
