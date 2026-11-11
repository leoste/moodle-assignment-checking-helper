import type { VsCodeRequestStatus } from '@shared/types/VsCodeMessage'
import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { studentSubmissionChromeMessageGenerator } from '../../shared/generator/StudentSubmissionChromeMessageGenerator'

// This is the Visual Studio Code communicating client

class StudentSubmissionClient extends ChromeMessageClient {
  // Undefined when the service worker couldn't handle the message.
  async openStudentSubmission(studentName: string): Promise<VsCodeRequestStatus | undefined> {
    return this.send(studentSubmissionChromeMessageGenerator.getOpenStudentSubmissionMessage(studentName))
  }
}

export const studentSubmissionClient = new StudentSubmissionClient()
