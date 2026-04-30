import { assignmentRepository } from './AssignmentRepository'
import { commonAnswerRepository } from './CommonAnswerRepository'
import { fileRefreshController } from '../controller/FileRefreshController'
import { gradePartRepository } from './GradePartRepository'
import { quizRepository } from './QuizRepository'

export default function initRepositories(): void {
  assignmentRepository.init()
  commonAnswerRepository.init()
  gradePartRepository.init()
  quizRepository.init()

  fileRefreshController.registerSource(assignmentRepository.fileSourceInfo)
}
