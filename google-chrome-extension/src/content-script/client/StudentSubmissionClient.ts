import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { studentSubmissionChromeMessageGenerator } from '../../shared/generator/StudentSubmissionChromeMessageGenerator'

// This is the Visual Studio Code communicating client

class StudentSubmissionClient extends ChromeMessageClient {
  async openStudentSubmission(studentName: string): Promise<unknown> {
    return this.send(studentSubmissionChromeMessageGenerator.getOpenStudentSubmissionMessage(studentName))
  }
}

export const studentSubmissionClient = new StudentSubmissionClient()
