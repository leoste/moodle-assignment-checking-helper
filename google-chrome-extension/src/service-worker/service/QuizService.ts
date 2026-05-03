import type { AutoGradeId } from '../../shared/types'
import { quizRepository } from '../repository/QuizRepository'
import BaseService from '@shared/service/BaseService'

class QuizService extends BaseService {
  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await quizRepository.beginAutoGrade(id)
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await quizRepository.endAutoGrade(id)
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return quizRepository.isAutoGradeActive(id)
  }
}

export const quizService = new QuizService()