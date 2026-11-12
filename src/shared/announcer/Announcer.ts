import BaseAnnouncer from './BaseAnnouncer'
import { reporter } from '../reporter/Reporter'
import type { Status, StatusTopic } from '../types/Status'
import {
  LOG_LEVEL_ERROR,
  LOG_LEVEL_INFO,
  LOG_PREFIX,
  NEWS_TYPE_LOG,
  NEWS_TYPE_RECEPTION,
  NEWS_TYPE_SETTINGS_UPDATED,
  NEWS_TYPE_STATUS,
  STATUS_CHANGE_ALL_CLEARED,
  STATUS_CHANGE_CLEARED,
  STATUS_CHANGE_REPORTED,
} from '../constants/news'

type LogSource = object | string

// Called by any code that has news. Every piece of news goes to the reporter of its context.
class Announcer extends BaseAnnouncer {
  announceLog(source: LogSource, message: string, data?: unknown): void {
    reporter.report({ type: NEWS_TYPE_LOG, level: LOG_LEVEL_INFO, line: this.#format(source, message), details: data })
  }

  announceLogError(source: LogSource, message: string, error?: unknown): void {
    reporter.report({ type: NEWS_TYPE_LOG, level: LOG_LEVEL_ERROR, line: this.#format(source, message), details: error })
  }

  // A new status replaces the old one of its topic.
  announceStatus(status: Status): void {
    reporter.report({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_REPORTED, status })
  }

  announceStatusCleared(topic: StatusTopic): void {
    reporter.report({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_CLEARED, topic })
  }

  announceStatusesCleared(): void {
    reporter.report({ type: NEWS_TYPE_STATUS, change: STATUS_CHANGE_ALL_CLEARED })
  }

  announceReception(receiving: boolean): void {
    reporter.report({ type: NEWS_TYPE_RECEPTION, receiving })
  }

  announceSettingsUpdated(): void {
    reporter.report({ type: NEWS_TYPE_SETTINGS_UPDATED })
  }

  #format(source: LogSource, message: string): string {
    const name = typeof source === 'string' ? source : source.constructor.name
    return `${LOG_PREFIX}[${name}] ${message}`
  }
}

export const announcer = new Announcer()
