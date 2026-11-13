import BaseStatusAnnouncer from './BaseStatusAnnouncer'
import { ANNOUNCER_GRADING } from '../../foundation/constants/news'

class GradingAnnouncer extends BaseStatusAnnouncer {
  constructor() {
    super(ANNOUNCER_GRADING)
  }
}

export const gradingAnnouncer = new GradingAnnouncer()
