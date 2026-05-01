import { commonAnswerController } from './CommonAnswerController'
import { fileRefreshController } from './FileCacheController'
import { gradePartController } from './GradePartController'
import { pageInfoController } from './PageInfoController'
import { quizController } from './QuizController'

export default function initControllers(): void {
  fileRefreshController.init()
  commonAnswerController.init()
  gradePartController.init()
  pageInfoController.init()
  quizController.init()
}
