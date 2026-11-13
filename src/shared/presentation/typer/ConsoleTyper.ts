import BaseTyper from './BaseTyper'
import { logWatcher } from '../../communication/watcher/LogWatcher'
import { consoleProvider } from '../../foundation/infrastructure/ConsoleProvider'
import type { LogNews } from '../../business/types/News'
import { LOG_LEVEL_INFO } from '../../foundation/constants/news'

class ConsoleTyper extends BaseTyper {
  protected override onInit(): undefined {
    logWatcher.subscribe(this.#write)
  }

  readonly #write = (news: LogNews): void => {
    if (news.level === LOG_LEVEL_INFO) consoleProvider.info(news.line, news.details)
    else consoleProvider.error(news.line, news.details)
  }
}

export const consoleTyper = new ConsoleTyper()
