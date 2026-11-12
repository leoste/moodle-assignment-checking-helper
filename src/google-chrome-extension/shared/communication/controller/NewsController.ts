import ChromePortController from './ChromePortController'
import { chromePortProvider } from '../../foundation/infrastructure/ChromePortProvider'
import { statusLineWatcher } from '@shared/communication/watcher/StatusLineWatcher'
import { announcer } from '@shared/communication/announcer/Announcer'
import { getWaitingStatus } from '@shared/business/rules/status-rules'
import { NEWS_REPORT } from '../../foundation/constants/messages'

// The status line of the panel and of the popup follows the service worker's reporter.
class NewsController extends ChromePortController {
  protected override onInit(): undefined {
    this.addMessageHandler(NEWS_REPORT, async ({ news }) => {
      statusLineWatcher.watch(news)
    })

    // When Chrome stops the idle service worker, its WebSocket to VS Code closes together with the port,
    // so a closed port means the connection is waiting.
    chromePortProvider.setLostHandler(() => {
      announcer.announceStatus(getWaitingStatus())
    })
  }
}

export const newsController = new NewsController()
