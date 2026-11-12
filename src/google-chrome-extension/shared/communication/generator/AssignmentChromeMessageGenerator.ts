import ChromeMessageGenerator from './ChromeMessageGenerator'
import { ASSIGNMENTS_GET_ALL, ASSIGNMENTS_UPDATED } from '../../foundation/constants/messages'
import type { BasePayload } from '@shared/business/types/BasePayload'
import type { ChromeMessage } from '../../business/types/ChromeMessage'

class AssignmentChromeMessageGenerator extends ChromeMessageGenerator {
  getAllAssignmentsMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(ASSIGNMENTS_GET_ALL, {})
  }

  getAssignmentsUpdatedMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(ASSIGNMENTS_UPDATED, {})
  }
}

export const assignmentChromeMessageGenerator = new AssignmentChromeMessageGenerator()
