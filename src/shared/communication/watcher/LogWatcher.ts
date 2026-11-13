import FireAndForgetWatcher from './FireAndForgetWatcher'
import type BaseReporter from '../reporter/BaseReporter'
import { logReporter } from '../reporter/LogReporter'
import type { LogNews, News } from '../../business/types/News'
import { NEWS_TYPE_LOG } from '../../foundation/constants/news'

class LogWatcher extends FireAndForgetWatcher<LogNews> {
  protected getReporters(): readonly BaseReporter[] {
    return [logReporter]
  }

  protected notice(news: News): LogNews | undefined {
    return news.type === NEWS_TYPE_LOG ? news : undefined
  }
}

export const logWatcher = new LogWatcher()
