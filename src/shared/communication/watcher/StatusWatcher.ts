import RememberingWatcher from './RememberingWatcher'
import type BaseReporter from '../reporter/BaseReporter'
import { statusReporter } from '../reporter/StatusReporter'
import type { News } from '../../business/types/News'
import type { Status, StatusTopic } from '../../business/types/Status'
import { NEWS_TYPE_STATUS, STATUS_CHANGE_CLEARED, STATUS_CHANGE_REPORTED } from '../../foundation/constants/news'
import { STATUS_TOPICS } from '../../foundation/constants/status'

// Keeps the current status of every topic, whichever announcer it came from: a new status replaces the old one of its topic.
class StatusWatcher extends RememberingWatcher<readonly Status[]> {
  readonly #statuses = new Map<StatusTopic, Status>()

  protected getReporters(): readonly BaseReporter[] {
    return [statusReporter]
  }

  protected remember(news: News): boolean {
    if (news.type !== NEWS_TYPE_STATUS) return false
    if (news.change === STATUS_CHANGE_REPORTED) this.#statuses.set(news.status.topic, news.status)
    else if (news.change === STATUS_CHANGE_CLEARED) this.#statuses.delete(news.topic)
    else this.#statuses.clear()
    return true
  }

  // In the order in which the topics are shown.
  protected recall(): readonly Status[] {
    return STATUS_TOPICS
      .map(topic => this.#statuses.get(topic))
      .filter(status => status !== undefined)
  }

  protected forget(): void {
    this.#statuses.clear()
  }
}

export const statusWatcher = new StatusWatcher()
