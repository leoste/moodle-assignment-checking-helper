import type { Feedback } from '../../shared/types/Feedback'
import BaseClient from '../../shared/client/BaseClient'
import { FEEDBACK_GET } from '../../shared/constants/messages'

export default class FeedbackClient extends BaseClient {
  async getData(assignmentId: string): Promise<Feedback[]> {
    const msg = this.makeMessage(FEEDBACK_GET, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<Feedback[]>
  }
}
