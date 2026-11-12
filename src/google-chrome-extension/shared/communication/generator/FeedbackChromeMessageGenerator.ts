import ChromeMessageGenerator from './ChromeMessageGenerator'
import { FEEDBACK_GET } from '../../foundation/constants/messages'
import type { ChromeMessage } from '../../business/types/ChromeMessage'
import type { AssignmentIdPayload } from '../../business/types/AssignmentIdPayload'

class FeedbackChromeMessageGenerator extends ChromeMessageGenerator {
  getFeedbackMessage(assignmentId: string): ChromeMessage<AssignmentIdPayload> {
    return this.makeMessage(FEEDBACK_GET, { assignmentId })
  }
}

export const feedbackChromeMessageGenerator = new FeedbackChromeMessageGenerator()
