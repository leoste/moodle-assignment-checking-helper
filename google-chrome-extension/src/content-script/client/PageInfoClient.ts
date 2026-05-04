import ChromeExtensionMessageClient from '../../shared/client/ChromeExtensionMessageClient'
import { PAGE_INFO_POST_STUDENT_NAME } from '../../shared/constants/messages'

// This is the Visual Studio Code communicating client

class PageInfoClient extends ChromeExtensionMessageClient {
  async postStudentName(studentName: string): Promise<unknown> {
    const msg = this.makeMessage(PAGE_INFO_POST_STUDENT_NAME, { studentName })
    return chrome.runtime.sendMessage(msg)
  }
}

export const pageInfoClient = new PageInfoClient()
