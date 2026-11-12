import WebviewMessageController from './WebviewMessageController'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import { receptionWatcher } from '../watcher/ReceptionWatcher'
import { settingsWatcher } from '../watcher/SettingsWatcher'
import { NEWS_REPORT } from '../../shared/constants/webview-messages'

// The sidebar's watchers follow the background's reporter.
class NewsController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(NEWS_REPORT, async ({ news }) => {
      statusLineWatcher.watch(news)
      receptionWatcher.watch(news)
      settingsWatcher.watch(news)
    })
  }
}

export const newsController = new NewsController()
