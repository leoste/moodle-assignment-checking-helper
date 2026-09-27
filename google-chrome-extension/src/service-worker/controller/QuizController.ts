import ChromeMessageController from './ChromeMessageController'
import { quizService } from '../service/QuizService'
import {
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
} from '../../shared/constants/messages'
import type { AutoGradeIdPayload } from '../../shared/types/payload/AutoGradeIdPayload'

class QuizController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler<AutoGradeIdPayload>(QUIZ_AUTO_GRADE_BEGIN, async ({ autoGradeId }) => {
      await quizService.beginAutoGrade(autoGradeId)
    })

    this.addMessageHandler<AutoGradeIdPayload>(QUIZ_AUTO_GRADE_END, async ({ autoGradeId }) => {
      await quizService.endAutoGrade(autoGradeId)
    })

    this.addMessageHandler<AutoGradeIdPayload>(QUIZ_AUTO_GRADE_IS_ACTIVE, async ({ autoGradeId }) => {
      return quizService.isAutoGradeActive(autoGradeId)
    })
  }
}

export const quizController = new QuizController()
