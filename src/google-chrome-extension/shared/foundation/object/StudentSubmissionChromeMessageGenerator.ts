import ChromeMessageGenerator from './ChromeMessageGenerator'
import { STUDENT_SUBMISSION_OPEN } from '../../foundation/constants/messages'
import type { ChromeMessage } from '../../business/types/ChromeMessage'
import type { StudentNamePayload } from '@shared/business/types/StudentNamePayload'

class StudentSubmissionChromeMessageGenerator extends ChromeMessageGenerator {
  getOpenStudentSubmissionMessage(studentName: string): ChromeMessage<StudentNamePayload> {
    return this.makeMessage(STUDENT_SUBMISSION_OPEN, { studentName })
  }
}

export const studentSubmissionChromeMessageGenerator = new StudentSubmissionChromeMessageGenerator()
