import repositoryRegistry from '../repository/repository-registry'
import type { AutoGradeId } from '../../types'

export default class QuizService {
  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await repositoryRegistry.quizRepository.beginAutoGrade(id)
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await repositoryRegistry.quizRepository.endAutoGrade(id)
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return repositoryRegistry.quizRepository.isAutoGradeActive(id)
  }
}
