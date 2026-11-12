import type BaseController from '@shared/communication/controller/BaseController'
import { assignmentController } from './AssignmentController'
import { fileCacheController } from './FileCacheController'
import { studentSubmissionController } from './StudentSubmissionController'
import { quizController } from './QuizController'
import { newsController } from './NewsController'

export const controllers: readonly BaseController[] = [
  fileCacheController,
  assignmentController,
  studentSubmissionController,
  quizController,
  newsController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
