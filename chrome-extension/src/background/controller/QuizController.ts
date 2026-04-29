import BaseController from './BaseController'
import serviceRegistry from '../service/service-registry'
import type { AutoGradeId } from '../../types'

export default class QuizController extends BaseController {
  static readonly #BEGIN  = 'quiz/auto-grade/begin'
  static readonly #END    = 'quiz/auto-grade/end'
  static readonly #ACTIVE = 'quiz/auto-grade/is-active'

  override init(): void {
    super.init()

    this.addMessageHandler(QuizController.#BEGIN, async (content) => {
      await serviceRegistry.quizService.beginAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QuizController.#END, async (content) => {
      await serviceRegistry.quizService.endAutoGrade(content.autoGradeId as AutoGradeId)
    })

    this.addMessageHandler(QuizController.#ACTIVE, async (content) => {
      return serviceRegistry.quizService.isAutoGradeActive(content.autoGradeId as AutoGradeId)
    })
  }
}
