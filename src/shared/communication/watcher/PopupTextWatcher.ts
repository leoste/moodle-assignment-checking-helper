import FireAndForgetWatcher from './FireAndForgetWatcher'
import type BaseReporter from '../reporter/BaseReporter'
import { statusReporter } from '../reporter/StatusReporter'
import type { News } from '../../business/types/News'
import { NEWS_TYPE_STATUS, STATUS_CHANGE_REPORTED } from '../../foundation/constants/news'

// Notices every status that carries a popup text.
class PopupTextWatcher extends FireAndForgetWatcher<string> {
  protected getReporters(): readonly BaseReporter[] {
    return [statusReporter]
  }

  protected notice(news: News): string | undefined {
    if (news.type !== NEWS_TYPE_STATUS || news.change !== STATUS_CHANGE_REPORTED) return undefined
    return news.status.popupText || undefined
  }
}

export const popupTextWatcher = new PopupTextWatcher()
