import type { CommonAnswer } from '../../types'
import AssignmentRepository from './AssignmentRepository'

class CommonAnswerRepository extends AssignmentRepository {
  async getAll(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    const definition = await this.findByMoodleId(assignmentId)
    return definition?.commonAnswers
  }
}

export const commonAnswerRepository = new CommonAnswerRepository()
