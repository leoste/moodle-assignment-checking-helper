import FireAndForgetWatcher from './FireAndForgetWatcher'
import type BaseReporter from '../reporter/BaseReporter'
import { settingsReporter } from '../reporter/SettingsReporter'
import type { News, SettingsUpdatedNews } from '../../business/types/News'
import { NEWS_TYPE_SETTINGS_UPDATED } from '../../foundation/constants/news'

class SettingsWatcher extends FireAndForgetWatcher<SettingsUpdatedNews> {
  protected getReporters(): readonly BaseReporter[] {
    return [settingsReporter]
  }

  protected notice(news: News): SettingsUpdatedNews | undefined {
    return news.type === NEWS_TYPE_SETTINGS_UPDATED ? news : undefined
  }
}

export const settingsWatcher = new SettingsWatcher()
