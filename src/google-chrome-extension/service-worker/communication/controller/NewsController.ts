import ChromePortController from './ChromePortController'
import { reporter } from '@shared/communication/reporter/Reporter'
import { NEWS_SUBSCRIBE } from '../../../shared/foundation/constants/messages'

// A panel or the popup starts following the service worker's reporter and is briefed with the news that is still true.
class NewsController extends ChromePortController {
  protected override onInit(): undefined {
    this.addMessageHandler(NEWS_SUBSCRIBE, async () => reporter.getBriefing())
  }
}

export const newsController = new NewsController()
