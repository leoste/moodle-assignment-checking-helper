import BaseController from './BaseController'
import type { AutoGradeId } from '../../types'
import { quizService } from '../service/QuizService'

export default class QuizController extends BaseController {
  static readonly #BEGIN  = 'quiz/auto-grade/begin'
  static readonly #END    = 'quiz/auto-grade/end'
  static readonly #ACTIVE = 'quiz/auto-grade/is-active'

  override init(): void {
    super.init()

    this.addMessageHandler(QuizController.#BEGIN, async (content) => {
      await quizService.beginAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QuizController.#END, async (content) => {
      await quizService.endAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QuizController.#ACTIVE, async (content) => {
      return quizService.isAutoGradeActive(content.autoGradeId as AutoGradeId)
    })
  }
}
