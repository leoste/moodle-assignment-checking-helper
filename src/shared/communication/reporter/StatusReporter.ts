import BaseReporter from './BaseReporter'
import type BaseAnnouncer from '../announcer/BaseAnnouncer'
import { connectionAnnouncer } from '../announcer/ConnectionAnnouncer'
import { gradingAnnouncer } from '../announcer/GradingAnnouncer'
import { definitionsAnnouncer } from '../announcer/DefinitionsAnnouncer'
import { studentSubmissionAnnouncer } from '../announcer/StudentSubmissionAnnouncer'

class StatusReporter extends BaseReporter {
  protected getAnnouncers(): readonly BaseAnnouncer[] {
    return [connectionAnnouncer, gradingAnnouncer, definitionsAnnouncer, studentSubmissionAnnouncer]
  }
}

export const statusReporter = new StatusReporter()
