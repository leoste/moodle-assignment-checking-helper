import BaseWatcher from '@shared/communication/watcher/BaseWatcher'
import type { News } from '@shared/business/types/News'
import { NEWS_TYPE_STATUS, STATUS_CHANGE_REPORTED } from '@shared/foundation/constants/news'
import { notificationProvider } from '../../foundation/infrastructure/NotificationProvider'

// Pops up every status that carries a popup text.
class NotificationWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_STATUS || news.change !== STATUS_CHANGE_REPORTED) return
    if (news.status.popupText) notificationProvider.showWarning(news.status.popupText)
  }
}

export const notificationWatcher = new NotificationWatcher()
