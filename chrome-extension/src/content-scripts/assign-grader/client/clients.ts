/// <reference lib="dom" />
import type { CommonAnswer, GradePart, ExtensionMessage } from '../../../types'

function makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
  return { type, content }
}

export class CommonAnswersClient {
  static readonly #TYPE = 'common-answers/get'

  async getData(assignmentId: string): Promise<CommonAnswer[]> {
    const msg = makeMessage(CommonAnswersClient.#TYPE, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<CommonAnswer[]>
  }
}

export class GradePartsClient {
  static readonly #TYPE = 'assignment/grade-parts/get'

  async getData(assignmentId: string): Promise<GradePart[]> {
    const msg = makeMessage(GradePartsClient.#TYPE, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<GradePart[]>
  }
}

export class PageInfoClient {
  static readonly #TYPE = 'page-info/student-name/post'

  async postStudentName(studentName: string): Promise<unknown> {
    const msg = makeMessage(PageInfoClient.#TYPE, { studentName })
    return chrome.runtime.sendMessage(msg)
  }
}
