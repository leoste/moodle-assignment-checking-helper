import CommonAnswerController from './CommonAnswerController'
import { fileRefreshController } from './FileRefreshController'
import GradePartController from './GradePartController'
import PageInfoController from './PageInfoController'
import QuizController from './QuizController'

export default function initControllers(): void {
  fileRefreshController.init()
  new CommonAnswerController().init()
  new GradePartController().init()
  new PageInfoController().init()
  new QuizController().init()
}
