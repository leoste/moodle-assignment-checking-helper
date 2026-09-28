import type { Assignment } from '../../shared/types/Assignment'
import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { assignmentChromeMessageGenerator } from '../../shared/generator/AssignmentChromeMessageGenerator'

class AssignmentClient extends ChromeMessageClient {
  async getAllAssignments(): Promise<Assignment[]> {
    return this.send<Assignment[]>(assignmentChromeMessageGenerator.getAllAssignmentsMessage())
  }
}

export const assignmentClient = new AssignmentClient()
