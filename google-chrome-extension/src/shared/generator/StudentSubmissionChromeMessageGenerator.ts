import ChromeMessageGenerator from './ChromeMessageGenerator'
import { STUDENT_SUBMISSION_OPEN } from '../constants/messages'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class StudentSubmissionChromeMessageGenerator extends ChromeMessageGenerator {
  getOpenStudentSubmissionMessage(studentName: string): ChromeMessage<StudentNamePayload> {
    return this.makeMessage(STUDENT_SUBMISSION_OPEN, { studentName })
  }
}

export const studentSubmissionChromeMessageGenerator = new StudentSubmissionChromeMessageGenerator()
