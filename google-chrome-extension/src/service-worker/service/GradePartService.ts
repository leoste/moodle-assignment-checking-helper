import type { GradePart } from '../../shared/types'
import { gradePartRepository } from '../repository/GradePartRepository'
import BaseService from '@shared/service/BaseService'

class GradePartService extends BaseService {
  async getAll(assignmentId: string): Promise<GradePart[] | undefined> {
    return gradePartRepository.getAll(assignmentId)
  }
}

export const gradePartService = new GradePartService()