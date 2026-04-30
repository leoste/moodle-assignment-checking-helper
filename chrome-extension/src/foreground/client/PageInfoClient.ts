import BaseClient from "./BaseClient"

// This is the Visual Studio Code communicating client

class PageInfoClient extends BaseClient {
  static readonly #TYPE = 'page-info/student-name/post'

  async postStudentName(studentName: string): Promise<unknown> {
    const msg = this.makeMessage(PageInfoClient.#TYPE, { studentName })
    return chrome.runtime.sendMessage(msg)
  }
}

export const pageInfoClient = new PageInfoClient()