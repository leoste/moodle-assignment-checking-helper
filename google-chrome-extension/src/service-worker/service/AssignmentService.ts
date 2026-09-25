import type { Feedback } from '../../shared/types/Feedback'
import { assignmentRepository } from '../repository/AssignmentRepository'
import BaseService from '@shared/service/BaseService'

class AssignmentService extends BaseService {
  async getFeedback(assignmentId: string): Promise<Feedback[] | undefined> {
    return assignmentRepository.getFeedback(assignmentId)
  }
}

export const assignmentService = new AssignmentService()
