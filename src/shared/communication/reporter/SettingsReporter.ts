import BaseReporter from './BaseReporter'
import type BaseAnnouncer from '../announcer/BaseAnnouncer'
import { settingsAnnouncer } from '../announcer/SettingsAnnouncer'

class SettingsReporter extends BaseReporter {
  protected getAnnouncers(): readonly BaseAnnouncer[] {
    return [settingsAnnouncer]
  }
}

export const settingsReporter = new SettingsReporter()
