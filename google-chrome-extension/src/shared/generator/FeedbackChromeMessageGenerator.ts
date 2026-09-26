import ChromeMessageGenerator from './ChromeMessageGenerator'
import { FEEDBACK_GET } from '../constants/messages'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { AssignmentIdPayload } from '../types/payload/AssignmentIdPayload'

class FeedbackChromeMessageGenerator extends ChromeMessageGenerator {
  getFeedbackMessage(assignmentId: string): ChromeMessage<AssignmentIdPayload> {
    return this.makeMessage(FEEDBACK_GET, { assignmentId })
  }
}

export const feedbackChromeMessageGenerator = new FeedbackChromeMessageGenerator()
