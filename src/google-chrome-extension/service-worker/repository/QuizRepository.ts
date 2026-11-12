import LocalStorageRepository from '../../shared/repository/LocalStorageRepository'
import type { AutoGradeId } from '../../shared/business/types/AutoGradeId'
import type { AutoGradeKey } from '../../shared/business/types/StorageSchema'
import { AUTO_GRADE_KEY_PREFIX } from '../../shared/foundation/constants/storage'

class QuizRepository extends LocalStorageRepository {
  #key(id: AutoGradeId): AutoGradeKey {
    return `${AUTO_GRADE_KEY_PREFIX}:${id.quizId}:${id.questionNumber}:${id.attemptId}`
  }

  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await this.setValue(this.#key(id), true)
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await this.removeValue(this.#key(id))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    const value = await this.getValue(this.#key(id))
    return !!value
  }
}

export const quizRepository = new QuizRepository()
