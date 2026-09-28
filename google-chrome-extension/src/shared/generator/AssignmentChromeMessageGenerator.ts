import ChromeMessageGenerator from './ChromeMessageGenerator'
import { ASSIGNMENTS_GET_ALL } from '../constants/messages'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { ChromeMessage } from '../types/ChromeMessage'

class AssignmentChromeMessageGenerator extends ChromeMessageGenerator {
  getAllAssignmentsMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(ASSIGNMENTS_GET_ALL, {})
  }
}

export const assignmentChromeMessageGenerator = new AssignmentChromeMessageGenerator()
