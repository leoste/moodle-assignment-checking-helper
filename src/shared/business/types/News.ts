import type {
  LOG_LEVEL_ERROR,
  LOG_LEVEL_INFO,
  NEWS_TYPE_LOG,
  NEWS_TYPE_RECEPTION,
  NEWS_TYPE_SETTINGS_UPDATED,
  NEWS_TYPE_STATUS,
  STATUS_CHANGE_ALL_CLEARED,
  STATUS_CHANGE_CLEARED,
  STATUS_CHANGE_REPORTED,
} from '../../foundation/constants/news'
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

// Whether this VS Code window receives the students.
export interface ReceptionNews {
  type: typeof NEWS_TYPE_RECEPTION
  receiving: boolean
}

// The settings are stored data, so the news only says that they changed: whoever shows them asks for them again.
export interface SettingsUpdatedNews {
  type: typeof NEWS_TYPE_SETTINGS_UPDATED
}

export type News = LogNews | StatusNews | ReceptionNews | SettingsUpdatedNews
