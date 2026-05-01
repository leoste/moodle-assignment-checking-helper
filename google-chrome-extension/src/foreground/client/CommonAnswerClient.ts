import type { CommonAnswer } from '../../shared/types'
import BaseClient from './BaseClient'
import { COMMON_ANSWERS_GET } from '../../shared/constants/messages'

export default class CommonAnswersClient extends BaseClient {
  async getData(assignmentId: string): Promise<CommonAnswer[]> {
    const msg = this.makeMessage(COMMON_ANSWERS_GET, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<CommonAnswer[]>
  }
}
