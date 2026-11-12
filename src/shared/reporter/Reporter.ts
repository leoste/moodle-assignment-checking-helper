import BaseReporter from './BaseReporter'
import type BaseWatcher from '../watcher/BaseWatcher'
import { consoleWatcher } from '../watcher/ConsoleWatcher'
import type { News, StatusReportedNews } from '../types/News'
import type { StatusTopic } from '../types/Status'
import type { WatcherClient } from '../types/WatcherClient'
import {
  LOG_LEVEL_ERROR,
  LOG_PREFIX,
  NEWS_TYPE_LOG,
  NEWS_TYPE_STATUS,
  STATUS_CHANGE_ALL_CLEARED,
  STATUS_CHANGE_CLEARED,
  STATUS_CHANGE_REPORTED,
} from '../constants/news'
import { STATUS_TOPICS } from '../constants/status'

// Hands every piece of news to the watchers of its context, and the news that may leave the context to the watchers
// of other contexts through its clients. The entry file of the context chooses the watchers and the clients.
class Reporter extends BaseReporter {
  readonly #watchers: BaseWatcher[] = []
  readonly #clients: WatcherClient[] = []
  // The statuses that are still true, for briefing the watchers that come later.
  readonly #statuses = new Map<StatusTopic, StatusReportedNews>()
  #warnedOfNoWatchers = false

  addWatcher(watcher: BaseWatcher): void {
    this.#watchers.push(watcher)
    this.getBriefing().forEach(news => watcher.watch(news))
  }

  addClient(client: WatcherClient): void {
    this.#clients.push(client)
  }

  report(news: News): void {
    this.#remember(news)
    this.#getWatchers(news).forEach(watcher => watcher.watch(news))
    // Log news never leaves its context.
    if (news.type !== NEWS_TYPE_LOG) this.#clients.forEach(client => void client.report(news))
  }

  getBriefing(): News[] {
    return STATUS_TOPICS
      .map(topic => this.#statuses.get(topic))
      .filter(news => news !== undefined)
  }

  #remember(news: News): void {
    if (news.type !== NEWS_TYPE_STATUS) return
    switch (news.change) {
      case STATUS_CHANGE_REPORTED:
        this.#statuses.set(news.status.topic, news)
        break
      case STATUS_CHANGE_CLEARED:
        this.#statuses.delete(news.topic)
        break
      case STATUS_CHANGE_ALL_CLEARED:
        this.#statuses.clear()
        break
    }
  }

  // A log line announced before the entry file chose the watchers still shows in the console.
  #getWatchers(news: News): readonly BaseWatcher[] {
    if (this.#watchers.length > 0 || news.type !== NEWS_TYPE_LOG) return this.#watchers
    if (!this.#warnedOfNoWatchers) {
      this.#warnedOfNoWatchers = true
      consoleWatcher.watch({
        type: NEWS_TYPE_LOG,
        level: LOG_LEVEL_ERROR,
        line: `${LOG_PREFIX}[Reporter] Used before the watchers were chosen, logging to the console.`,
      })
    }
    return [consoleWatcher]
  }
}

export const reporter = new Reporter()
