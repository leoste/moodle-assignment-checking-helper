import { STUDENT_SUBMISSION_CHANNEL } from '@shared/constants/vscode-message'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'
import { studentSubmissionService } from '../service/StudentSubmissionService'
import VsCodeMessageController from './VsCodeMessageController'

class StudentSubmissionController extends VsCodeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler<StudentNamePayload>(STUDENT_SUBMISSION_CHANNEL, async ({ studentName }) => {
      await studentSubmissionService.openStudentSubmission(studentName)
    })
  }
}

export const studentSubmissionController = new StudentSubmissionController()
