import type { CommonAnswer } from '../../types'
import BaseClient from './BaseClient'

export default class CommonAnswersClient extends BaseClient {
  static readonly #TYPE = 'common-answers/get'

  async getData(assignmentId: string): Promise<CommonAnswer[]> {
    const msg = this.makeMessage(CommonAnswersClient.#TYPE, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<CommonAnswer[]>
  }
}