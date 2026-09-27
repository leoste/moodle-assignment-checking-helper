import { studentSubmissionService } from '../service/StudentSubmissionService'
import ChromeMessageController from './ChromeMessageController'
import { STUDENT_SUBMISSION_OPEN } from '../../shared/constants/messages'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class StudentSubmissionController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler<StudentNamePayload>(STUDENT_SUBMISSION_OPEN, async ({ studentName }) => {
      return studentSubmissionService.openStudentSubmission(studentName)
    })
  }
}

export const studentSubmissionController = new StudentSubmissionController()
