import LocalStorageRepository from "./LocalStorageRepository.js";

export default class QuizRepository extends LocalStorageRepository {

  #getKey(autoGradeId) {
    const { quizId, questionNumber, attemptId } = autoGradeId;
    return `autograde:${quizId}:${questionNumber}:${attemptId}`;
  }
  
  async beginAutoGrade(autoGradeId) {
    const key = this.#getKey(autoGradeId)
    await this.setValue(key, true)
  }

  async endAutoGrade(autoGradeId) {
    const key = this.#getKey(autoGradeId)
    await this.removeValue(key)
  }

  async isAutoGradeActive(autoGradeId) {
    const key = this.#getKey(autoGradeId)
    const value = await this.getValue(key)
    return !!value
  }
}
