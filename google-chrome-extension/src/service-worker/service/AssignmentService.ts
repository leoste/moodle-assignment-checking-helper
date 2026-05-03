import type { CommonAnswer } from '../../shared/types/CommonAnswer'
import type { GradePart } from '../../shared/types/GradePart'
import { assignmentRepository } from '../repository/AssignmentRepository'
import BaseService from '@shared/service/BaseService'

export default class AssignmentService extends BaseService {
  async getCommonAnswers(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    return assignmentRepository.getCommonAnswers(assignmentId)
  }

  async getGradeParts(assignmentId: string): Promise<GradePart[] | undefined> {
    return assignmentRepository.getGradeParts(assignmentId)
  }
}

export const assignmentService = new AssignmentService()
