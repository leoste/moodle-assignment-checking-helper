import ChromeExtensionMessageController from './ChromeExtensionMessageController'
import type { AutoGradeId } from '../../shared/types/AutoGradeId'
import { quizService } from '../service/QuizService'
import {
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
} from '../../shared/constants/messages'

class QuizController extends ChromeExtensionMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(QUIZ_AUTO_GRADE_BEGIN, async (content) => {
      await quizService.beginAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QUIZ_AUTO_GRADE_END, async (content) => {
      await quizService.endAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QUIZ_AUTO_GRADE_IS_ACTIVE, async (content) => {
      return quizService.isAutoGradeActive(content.autoGradeId as AutoGradeId)
    })
  }
}

export const quizController = new QuizController()
