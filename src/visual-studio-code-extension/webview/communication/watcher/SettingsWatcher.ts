import BaseWatcher from '@shared/communication/watcher/BaseWatcher'
import type { News } from '@shared/business/types/News'
import { NEWS_TYPE_SETTINGS_UPDATED } from '@shared/foundation/constants/news'
import { sidebarPageListener } from '../../presentation/listener/SidebarPageListener'

// The settings changed: the page asks for them again, the way it asks for them when it starts.
class SettingsWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_SETTINGS_UPDATED) return
    void sidebarPageListener.refreshSettings()
  }
}

export const settingsWatcher = new SettingsWatcher()
