import BaseAnnouncer from './BaseAnnouncer'
import {
  ANNOUNCER_LOG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_INFO,
  LOG_PREFIX,
  NEWS_TYPE_LOG,
} from '../../foundation/constants/news'

type LogSource = object | string

class LogAnnouncer extends BaseAnnouncer {
  constructor() {
    super(ANNOUNCER_LOG)
  }

  override get staysInPart(): boolean {
    return true
  }

  announceLog(source: LogSource, message: string, data?: unknown): void {
    this.announce({ type: NEWS_TYPE_LOG, level: LOG_LEVEL_INFO, line: this.#format(source, message), details: data })
  }

  announceLogError(source: LogSource, message: string, error?: unknown): void {
    this.announce({ type: NEWS_TYPE_LOG, level: LOG_LEVEL_ERROR, line: this.#format(source, message), details: error })
  }

  #format(source: LogSource, message: string): string {
    const name = typeof source === 'string' ? source : source.constructor.name
    return `${LOG_PREFIX}[${name}] ${message}`
  }
}

export const logAnnouncer = new LogAnnouncer()
