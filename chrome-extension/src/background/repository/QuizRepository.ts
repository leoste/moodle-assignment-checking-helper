import LocalStorageRepository from './LocalStorageRepository'
import type { AutoGradeId } from '../../types'

export default class QuizRepository extends LocalStorageRepository {
  #key(id: AutoGradeId): string {
    return `autograde:${id.quizId}:${id.questionNumber}:${id.attemptId}`
  }

  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await this.setValue(this.#key(id), true)
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await this.removeValue(this.#key(id))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    const value = await this.getValue<boolean>(this.#key(id))
    return !!value
  }
}
