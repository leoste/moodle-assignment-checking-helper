import type { DefinitionLookup } from '../../shared/types/DefinitionLookup'
import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { feedbackChromeMessageGenerator } from '../../shared/generator/FeedbackChromeMessageGenerator'

class FeedbackClient extends ChromeMessageClient {
  // Undefined when the service worker couldn't handle the message.
  async getData(assignmentId: string): Promise<DefinitionLookup | undefined> {
    return this.send<DefinitionLookup | undefined>(feedbackChromeMessageGenerator.getFeedbackMessage(assignmentId))
  }
}

export const feedbackClient = new FeedbackClient()
