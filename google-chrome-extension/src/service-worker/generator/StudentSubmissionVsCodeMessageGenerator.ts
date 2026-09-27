import VsCodeMessageGenerator from './VsCodeMessageGenerator'
import { STUDENT_SUBMISSION_CHANNEL } from '@shared/constants/vscode-message'
import type { VsCodeMessage } from '@shared/types/VsCodeMessage'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class StudentSubmissionVsCodeMessageGenerator extends VsCodeMessageGenerator {
  getOpenStudentSubmissionMessage(studentName: string): VsCodeMessage<StudentNamePayload> {
    return this.makeMessage(STUDENT_SUBMISSION_CHANNEL, { studentName })
  }
}

export const studentSubmissionVsCodeMessageGenerator = new StudentSubmissionVsCodeMessageGenerator()
