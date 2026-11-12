import type { Definitions } from '../../../shared/business/types/Definitions'
import ChromeMessageClient from '../../../shared/communication/client/ChromeMessageClient'
import { assignmentChromeMessageGenerator } from '../../../shared/foundation/generator/AssignmentChromeMessageGenerator'

class AssignmentClient extends ChromeMessageClient {
  async getAllAssignments(): Promise<Definitions> {
    return this.send<Definitions>(assignmentChromeMessageGenerator.getAllAssignmentsMessage())
  }

  async notifyAssignmentsUpdated(): Promise<void> {
    await this.sendToTabs(assignmentChromeMessageGenerator.getAssignmentsUpdatedMessage())
  }
}

export const assignmentClient = new AssignmentClient()
