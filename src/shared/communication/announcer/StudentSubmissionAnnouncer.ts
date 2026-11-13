import BaseStatusAnnouncer from './BaseStatusAnnouncer'
import { ANNOUNCER_STUDENT_SUBMISSION } from '../../foundation/constants/news'

class StudentSubmissionAnnouncer extends BaseStatusAnnouncer {
  constructor() {
    super(ANNOUNCER_STUDENT_SUBMISSION)
  }
}

export const studentSubmissionAnnouncer = new StudentSubmissionAnnouncer()
