import WebviewMessageController from './WebviewMessageController'
import { reporter } from '@shared/reporter/Reporter'
import { NEWS_SUBSCRIBE } from '../shared/constants/webview-messages'

// The sidebar starts following the background's reporter and is briefed with the news that is still true.
class NewsController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(NEWS_SUBSCRIBE, async () => reporter.getBriefing())
  }
}

export const newsController = new NewsController()
