import type { Definitions } from '../../shared/types/Definitions'
import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { assignmentChromeMessageGenerator } from '../../shared/generator/AssignmentChromeMessageGenerator'

class AssignmentClient extends ChromeMessageClient {
  async getAllAssignments(): Promise<Definitions> {
    return this.send<Definitions>(assignmentChromeMessageGenerator.getAllAssignmentsMessage())
  }

  async notifyAssignmentsUpdated(): Promise<void> {
    await this.sendToTabs(assignmentChromeMessageGenerator.getAssignmentsUpdatedMessage())
  }
}

export const assignmentClient = new AssignmentClient()
