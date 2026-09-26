import type { Feedback } from '../../shared/types/Feedback'
import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { feedbackChromeMessageGenerator } from '../../shared/generator/FeedbackChromeMessageGenerator'

class FeedbackClient extends ChromeMessageClient {
  async getData(assignmentId: string): Promise<Feedback[]> {
    return this.send<Feedback[]>(feedbackChromeMessageGenerator.getFeedbackMessage(assignmentId))
  }
}

export const feedbackClient = new FeedbackClient()
