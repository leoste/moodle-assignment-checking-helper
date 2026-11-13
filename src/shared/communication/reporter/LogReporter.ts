import BaseReporter from './BaseReporter'
import type BaseAnnouncer from '../announcer/BaseAnnouncer'
import { logAnnouncer } from '../announcer/LogAnnouncer'

class LogReporter extends BaseReporter {
  protected getAnnouncers(): readonly BaseAnnouncer[] {
    return [logAnnouncer]
  }
}

export const logReporter = new LogReporter()
