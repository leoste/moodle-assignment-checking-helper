import BaseWatcher from './BaseWatcher'
import type { News } from '../../business/types/News'
import type { Status, StatusTopic } from '../../business/types/Status'
import { NEWS_TYPE_STATUS, STATUS_CHANGE_ALL_CLEARED, STATUS_CHANGE_CLEARED, STATUS_CHANGE_REPORTED } from '../../foundation/constants/news'
import { STATUS_TOPICS } from '../../foundation/constants/status'

// Keeps the current status of every topic, whichever reporter it came from: a new status replaces the old one of its topic.
export default abstract class StatusListWatcher extends BaseWatcher {
  readonly #statuses = new Map<StatusTopic, Status>()

  watch(news: News): void {
    if (news.type !== NEWS_TYPE_STATUS) return
    switch (news.change) {
      case STATUS_CHANGE_REPORTED:
        this.#statuses.set(news.status.topic, news.status)
        break
      case STATUS_CHANGE_CLEARED:
        this.#statuses.delete(news.topic)
        break
      case STATUS_CHANGE_ALL_CLEARED:
        this.#statuses.clear()
        break
    }
    this.show(this.getStatuses())
  }

  // In the order in which the topics are shown.
  protected getStatuses(): Status[] {
    return STATUS_TOPICS
      .map(topic => this.#statuses.get(topic))
      .filter(status => status !== undefined)
  }

  protected abstract show(statuses: readonly Status[]): void
}
