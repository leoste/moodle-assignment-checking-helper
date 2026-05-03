import { assignmentRepository } from './AssignmentRepository'
import { quizRepository } from './QuizRepository'

export default function initRepositories(): void {
  assignmentRepository.init()
  quizRepository.init()
}
