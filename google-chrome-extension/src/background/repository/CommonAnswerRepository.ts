import type { CommonAnswer } from '../../shared/types'
import { assignmentRepository } from './AssignmentRepository'
import BaseRepository from './BaseRepository'

class CommonAnswerRepository extends BaseRepository {
  async getAll(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    return assignmentRepository.getCommonAnswers(assignmentId)
  }
}

export const commonAnswerRepository = new CommonAnswerRepository()
