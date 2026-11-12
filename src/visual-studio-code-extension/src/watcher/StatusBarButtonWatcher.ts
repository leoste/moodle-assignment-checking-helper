import BaseWatcher from '@shared/watcher/BaseWatcher'
import type { News } from '@shared/types/News'
import { NEWS_TYPE_RECEPTION } from '@shared/constants/news'
import { translations } from '@shared/translations/translations'
import { statusBarButtonProvider } from '../infrastructure/StatusBarButtonProvider'
import { TAKE_OVER_COMMAND } from '../config'

// The take-over button next to the status bar item, shown only in a window that doesn't receive the students.
class StatusBarButtonWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_RECEPTION) return
    if (news.receiving) statusBarButtonProvider.hide()
    else statusBarButtonProvider.show(translations.connection.takeOver, TAKE_OVER_COMMAND)
  }
}

export const statusBarButtonWatcher = new StatusBarButtonWatcher()
