import type { DefinitionLookup } from '../../../shared/business/types/DefinitionLookup'
import ChromeMessageClient from '../../../shared/communication/client/ChromeMessageClient'
import { feedbackChromeMessageGenerator } from '../../../shared/foundation/object/FeedbackChromeMessageGenerator'

class FeedbackClient extends ChromeMessageClient {
  // Undefined when the service worker couldn't handle the message.
  async getData(assignmentId: string): Promise<DefinitionLookup | undefined> {
    return this.send<DefinitionLookup | undefined>(feedbackChromeMessageGenerator.getFeedbackMessage(assignmentId))
  }
}

export const feedbackClient = new FeedbackClient()
