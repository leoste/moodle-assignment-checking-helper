import VsCodeMessageGenerator from '@shared/foundation/object/VsCodeMessageGenerator'
import { STUDENT_SUBMISSION_CHANNEL } from '@shared/foundation/constants/vscode-message'
import type { VsCodeMessage } from '@shared/business/types/VsCodeMessage'
import type { StudentNamePayload } from '@shared/business/types/StudentNamePayload'

class StudentSubmissionVsCodeMessageGenerator extends VsCodeMessageGenerator {
  getOpenStudentSubmissionMessage(studentName: string): VsCodeMessage<StudentNamePayload> {
    return this.makeMessage(STUDENT_SUBMISSION_CHANNEL, { studentName })
  }
}

export const studentSubmissionVsCodeMessageGenerator = new StudentSubmissionVsCodeMessageGenerator()
