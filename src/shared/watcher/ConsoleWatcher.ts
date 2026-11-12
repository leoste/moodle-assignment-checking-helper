import BaseWatcher from './BaseWatcher'
import type { News } from '../types/News'
import { LOG_LEVEL_INFO, NEWS_TYPE_LOG } from '../constants/news'

class ConsoleWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_LOG) return
    if (news.level === LOG_LEVEL_INFO) {
      if (news.details === undefined) console.info(news.line)
      else console.info(news.line, news.details)
    } else {
      if (news.details === undefined) console.error(news.line)
      else console.error(news.line, news.details)
    }
  }
}

export const consoleWatcher = new ConsoleWatcher()
