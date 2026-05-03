import { assignmentController } from './AssignmentController'
import { fileRefreshController } from './FileCacheController'
import { pageInfoController } from './PageInfoController'
import { quizController } from './QuizController'

export default function initControllers(): void {
  fileRefreshController.init()
  assignmentController.init()
  pageInfoController.init()
  quizController.init()
}
