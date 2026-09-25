import { assignmentController } from './AssignmentController'
import { fileCacheController } from './FileCacheController'
import { pageInfoController } from './PageInfoController'
import { quizController } from './QuizController'

export default function initControllers(): void {
  fileCacheController.init()
  assignmentController.init()
  pageInfoController.init()
  quizController.init()
}
