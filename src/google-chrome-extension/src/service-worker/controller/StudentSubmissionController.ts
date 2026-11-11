import { studentSubmissionService } from '../service/StudentSubmissionService'
import ChromeMessageController from '../../shared/controller/ChromeMessageController'
import { STUDENT_SUBMISSION_OPEN } from '../../shared/constants/messages'

class StudentSubmissionController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(STUDENT_SUBMISSION_OPEN, async ({ studentName }) => {
      return studentSubmissionService.openStudentSubmission(studentName)
    })
  }
}

export const studentSubmissionController = new StudentSubmissionController()
