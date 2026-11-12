import WebviewMessageController from './WebviewMessageController'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import { NEWS_REPORT } from '../../shared/constants/webview-messages'

// The sidebar's status line follows the background's reporter.
class NewsController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(NEWS_REPORT, async ({ news }) => {
      statusLineWatcher.watch(news)
    })
  }
}

export const newsController = new NewsController()
