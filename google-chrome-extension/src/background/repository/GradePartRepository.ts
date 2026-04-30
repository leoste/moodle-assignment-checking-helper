import type { GradePart } from '../../types'
import AssignmentRepository from './AssignmentRepository'

class GradePartRepository extends AssignmentRepository {
  async getAll(assignmentId: string): Promise<GradePart[] | undefined> {
    const definition = await this.findByMoodleId(assignmentId)
    return definition?.gradeParts
  }
}

export const gradePartRepository = new GradePartRepository()
