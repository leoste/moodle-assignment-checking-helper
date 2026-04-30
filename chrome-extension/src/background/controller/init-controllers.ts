import CommonAnswerController from './CommonAnswerController'
import GradePartController from './GradePartController'
import PageInfoController from './PageInfoController'
import QuizController from './QuizController'

export default function initControllers(): void {
  new CommonAnswerController().init()
  new GradePartController().init()
  new PageInfoController().init()
  new QuizController().init()
}
