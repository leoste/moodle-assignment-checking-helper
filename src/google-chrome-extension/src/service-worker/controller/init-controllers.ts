import type ChromeMessageController from '../../shared/controller/ChromeMessageController'
import { assignmentController } from './AssignmentController'
import { fileCacheController } from './FileCacheController'
import { studentSubmissionController } from './StudentSubmissionController'
import { quizController } from './QuizController'

export const controllers: readonly ChromeMessageController[] = [
  fileCacheController,
  assignmentController,
  studentSubmissionController,
  quizController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
