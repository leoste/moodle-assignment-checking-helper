import BaseAnnouncer from './BaseAnnouncer'
import { ANNOUNCER_SETTINGS, NEWS_TYPE_SETTINGS_UPDATED } from '../../foundation/constants/news'

class SettingsAnnouncer extends BaseAnnouncer {
  constructor() {
    super(ANNOUNCER_SETTINGS)
  }

  announceSettingsUpdated(): void {
    this.announce({ type: NEWS_TYPE_SETTINGS_UPDATED })
  }
}

export const settingsAnnouncer = new SettingsAnnouncer()
