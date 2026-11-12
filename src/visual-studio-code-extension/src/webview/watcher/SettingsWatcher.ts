import BaseWatcher from '@shared/watcher/BaseWatcher'
import type { News } from '@shared/types/News'
import { NEWS_TYPE_SETTINGS_UPDATED } from '@shared/constants/news'
import { sidebarListener } from '../pagelistener/SidebarListener'

// The settings changed: the page asks for them again, the way it asks for them when it starts.
class SettingsWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_SETTINGS_UPDATED) return
    void sidebarListener.refreshSettings()
  }
}

export const settingsWatcher = new SettingsWatcher()
