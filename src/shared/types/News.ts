import type {
  LOG_LEVEL_ERROR,
  LOG_LEVEL_INFO,
  NEWS_TYPE_LOG,
  NEWS_TYPE_STATUS,
  STATUS_CHANGE_ALL_CLEARED,
  STATUS_CHANGE_CLEARED,
  STATUS_CHANGE_REPORTED,
} from '../constants/news'
import type { Status, StatusTopic } from './Status'

export type LogLevel = typeof LOG_LEVEL_INFO | typeof LOG_LEVEL_ERROR

// Never leaves the context it was announced in.
export interface LogNews {
  type: typeof NEWS_TYPE_LOG
  level: LogLevel
  line: string
  // The data of an info line, the error of an error line.
  details?: unknown
}

export interface StatusReportedNews {
  type: typeof NEWS_TYPE_STATUS
  change: typeof STATUS_CHANGE_REPORTED
  status: Status
}

export interface StatusClearedNews {
  type: typeof NEWS_TYPE_STATUS
  change: typeof STATUS_CHANGE_CLEARED
  topic: StatusTopic
}

export interface StatusesClearedNews {
  type: typeof NEWS_TYPE_STATUS
  change: typeof STATUS_CHANGE_ALL_CLEARED
}

export type StatusNews = StatusReportedNews | StatusClearedNews | StatusesClearedNews

export type News = LogNews | StatusNews
