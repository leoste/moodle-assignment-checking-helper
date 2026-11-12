import { STUDENT_SUBMISSION_CHANNEL } from '@shared/foundation/constants/vscode-message'
import { studentSubmissionService } from '../../service/StudentSubmissionService'
import VsCodeMessageController from './VsCodeMessageController'

class StudentSubmissionController extends VsCodeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(STUDENT_SUBMISSION_CHANNEL, async ({ studentName }) => {
      return studentSubmissionService.openStudentSubmission(studentName)
    })
  }
}

export const studentSubmissionController = new StudentSubmissionController()
