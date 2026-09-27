import BasePresenter from '../../shared/presenter/BasePresenter'
import type QuizCommentPage from '../pagemanager/QuizCommentPage'
import { quizClient } from '../client/QuizClient'
import { getAutoGrade } from '../rules/quiz-rules'

export default class QuizCommentPresenter extends BasePresenter {
  readonly #page: QuizCommentPage

  constructor(page: QuizCommentPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    const autoGradeId = this.#page.getQuestion().getAutoGradeId()
    const isActive = await quizClient.isAutoGradeActive(autoGradeId)

    if (isActive) {
      this.#page.setGrade(getAutoGrade(this.#page.getMaxMark()))

      await quizClient.endAutoGrade(autoGradeId)

      this.#page.submit()
    }
  }
}
