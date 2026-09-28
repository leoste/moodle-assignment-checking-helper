import type { Assignment } from '../../shared/types/Assignment'
import type { Feedback } from '../../shared/types/Feedback'
import { assignmentRepository } from '../repository/AssignmentRepository'
import BaseService from '@shared/service/BaseService'

class AssignmentService extends BaseService {
  async getAllAssignments(): Promise<Assignment[]> {
    return assignmentRepository.getAllDefinitions()
  }

  async getFeedback(assignmentId: string): Promise<Feedback[] | undefined> {
    const definition = await this.#findByMoodleId(assignmentId)
    return definition?.feedback
  }

  async #findByMoodleId(moodleId: string): Promise<Assignment | undefined> {
    const definitions = await assignmentRepository.getAllDefinitions()
    return definitions.find(d => d.moodleIds.some(id => String(id) === moodleId))
  }
}

export const assignmentService = new AssignmentService()
