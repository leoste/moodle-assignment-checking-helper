import BaseAnnouncer from './BaseAnnouncer'
import type { News } from '../../business/types/News'
import type { Status, StatusTopic } from '../../business/types/Status'
import {
  NEWS_TYPE_STATUS,
  STATUS_CHANGE_ALL_CLEARED,
  STATUS_CHANGE_CLEARED,
  STATUS_CHANGE_REPORTED,
} from '../../foundation/constants/news'

// What is still true of a status announcer is the current status of every topic it announced.
export default abstract class BaseStatusAnnouncer extends BaseAnnouncer {
  // A new status replaces the old one of its topic.
  announceStatus(status: Status): void {
    this.announce({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_REPORTED, status })
  }

  announceStatusCleared(topic: StatusTopic): void {
    this.announce({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_CLEARED, topic })
  }

  announceStatusesCleared(): void {
    this.announce({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_ALL_CLEARED })
  }

  override remember(stillTrue: readonly News[], news: News): News[] {
    if (news.type !== NEWS_TYPE_STATUS) return [...stillTrue]
    if (news.change === STATUS_CHANGE_REPORTED) return [...this.#without(stillTrue, news.status.topic), news]
    if (news.change === STATUS_CHANGE_CLEARED) return this.#without(stillTrue, news.topic)
    return []
  }

  #without(stillTrue: readonly News[], topic: StatusTopic): News[] {
    return stillTrue.filter(news =>
      news.type !== NEWS_TYPE_STATUS || news.change !== STATUS_CHANGE_REPORTED || news.status.topic !== topic)
  }
}
