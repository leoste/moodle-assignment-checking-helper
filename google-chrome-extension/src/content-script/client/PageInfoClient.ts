import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { pageInfoChromeMessageGenerator } from '../../shared/generator/PageInfoChromeMessageGenerator'

// This is the Visual Studio Code communicating client

class PageInfoClient extends ChromeMessageClient {
  async postStudentName(studentName: string): Promise<unknown> {
    return this.send(pageInfoChromeMessageGenerator.getStudentNameMessage(studentName))
  }
}

export const pageInfoClient = new PageInfoClient()
