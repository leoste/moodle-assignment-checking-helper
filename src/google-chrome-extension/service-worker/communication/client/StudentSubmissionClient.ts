import type { VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import VsCodeMessageClient from './VsCodeMessageClient'
import { studentSubmissionVsCodeMessageGenerator } from '../../foundation/object/StudentSubmissionVsCodeMessageGenerator'

class StudentSubmissionClient extends VsCodeMessageClient {
  async openStudentSubmission(studentName: string): Promise<VsCodeRequestStatus> {
    return this.send(studentSubmissionVsCodeMessageGenerator.getOpenStudentSubmissionMessage(studentName))
  }
}

export const studentSubmissionClient = new StudentSubmissionClient()
