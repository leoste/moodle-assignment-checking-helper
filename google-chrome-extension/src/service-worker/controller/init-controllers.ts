import type ChromeExtensionMessageController from './ChromeExtensionMessageController'
import { assignmentController } from './AssignmentController'
import { fileCacheController } from './FileCacheController'
import { pageInfoController } from './PageInfoController'
import { quizController } from './QuizController'

export const controllers: readonly ChromeExtensionMessageController[] = [
  fileCacheController,
  assignmentController,
  pageInfoController,
  quizController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
