import type { GradePart } from '../../shared/types'
import { assignmentRepository } from './AssignmentRepository'
import BaseRepository from './BaseRepository'

class GradePartRepository extends BaseRepository {
  async getAll(assignmentId: string): Promise<GradePart[] | undefined> {
    return assignmentRepository.getGradeParts(assignmentId)
  }
}

export const gradePartRepository = new GradePartRepository()
