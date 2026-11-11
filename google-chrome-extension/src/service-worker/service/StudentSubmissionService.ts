import BaseService from '@shared/service/BaseService'
import type { VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import { studentSubmissionClient } from '../client/StudentSubmissionClient'

class StudentSubmissionService extends BaseService {
  async openStudentSubmission(studentName: string): Promise<VsCodeRequestStatus> {
    return studentSubmissionClient.openStudentSubmission(studentName)
  }
}

export const studentSubmissionService = new StudentSubmissionService()
