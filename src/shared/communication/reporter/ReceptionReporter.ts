import BaseReporter from './BaseReporter'
import type BaseAnnouncer from '../announcer/BaseAnnouncer'
import { receptionAnnouncer } from '../announcer/ReceptionAnnouncer'

class ReceptionReporter extends BaseReporter {
  protected getAnnouncers(): readonly BaseAnnouncer[] {
    return [receptionAnnouncer]
  }
}

export const receptionReporter = new ReceptionReporter()
