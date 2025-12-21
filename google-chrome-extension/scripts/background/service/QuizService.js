import repositoryRegistry from "../repository/repository-registry.js";

export default class QuizService {

  async beginAutoGrade(autoGradeId) {
    await repositoryRegistry.quizRepository.beginAutoGrade(autoGradeId)
  }

  async endAutoGrade(autoGradeId) {
    await repositoryRegistry.quizRepository.endAutoGrade(autoGradeId)
  }

  async isAutoGradeActive(autoGradeId) {
    return await repositoryRegistry.quizRepository.isAutoGradeActive(autoGradeId)
  }
}