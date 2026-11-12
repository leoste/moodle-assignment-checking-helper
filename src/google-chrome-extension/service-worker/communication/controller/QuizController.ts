import ChromeMessageController from '../../../shared/communication/controller/ChromeMessageController'
import { quizService } from '../../service/QuizService'
import {
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
} from '../../../shared/foundation/constants/messages'

class QuizController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(QUIZ_AUTO_GRADE_BEGIN, async ({ autoGradeId }) => {
      await quizService.beginAutoGrade(autoGradeId)
    })

    this.addMessageHandler(QUIZ_AUTO_GRADE_END, async ({ autoGradeId }) => {
      await quizService.endAutoGrade(autoGradeId)
    })

    this.addMessageHandler(QUIZ_AUTO_GRADE_IS_ACTIVE, async ({ autoGradeId }) => {
      return quizService.isAutoGradeActive(autoGradeId)
    })
  }
}

export const quizController = new QuizController()
