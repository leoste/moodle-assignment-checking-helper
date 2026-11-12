import BasePresenter from '@shared/presenter/BasePresenter'
import type QuizCommentPage from '../pagemanager/QuizCommentPage'
import { quizClient } from '../client/QuizClient'
import { getAutoGrade } from '../rules/quiz-rules'
import { announcer } from '@shared/announcer/Announcer'

export default class QuizCommentPresenter extends BasePresenter {
  readonly #page: QuizCommentPage

  constructor(page: QuizCommentPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    const autoGradeId = this.#page.getQuestion().getAutoGradeId()
    const isActive = await quizClient.isAutoGradeActive(autoGradeId)
    announcer.announceLog(this, `auto grade ${isActive ? 'active' : 'not active'}`, autoGradeId)

    if (isActive) {
      const grade = getAutoGrade(this.#page.getMaxMark())
      this.#page.setGrade(grade)
      announcer.announceLog(this, `grade: ${grade}`)

      await quizClient.endAutoGrade(autoGradeId)

      announcer.announceLog(this, 'submitting')
      this.#page.submit()
    }
  }
}
