import type { VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import VsCodeMessageClient from './VsCodeMessageClient'
import { studentSubmissionVsCodeMessageGenerator } from '../generator/StudentSubmissionVsCodeMessageGenerator'

class StudentSubmissionClient extends VsCodeMessageClient {
  async openStudentSubmission(studentName: string): Promise<VsCodeResponseStatus> {
    return this.send(studentSubmissionVsCodeMessageGenerator.getOpenStudentSubmissionMessage(studentName))
  }
}

export const studentSubmissionClient = new StudentSubmissionClient()
