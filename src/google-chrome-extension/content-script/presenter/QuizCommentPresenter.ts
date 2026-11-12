import BasePresenter from '@shared/presenter/BasePresenter'
import type QuizCommentPageManager from '../manager/QuizCommentPageManager'
import { quizClient } from '../client/QuizClient'
import { getAutoGrade } from '../rules/quiz-rules'
import { announcer } from '@shared/announcer/Announcer'

export default class QuizCommentPresenter extends BasePresenter {
  readonly #pageManager: QuizCommentPageManager

  constructor(pageManager: QuizCommentPageManager) {
    super()
    this.#pageManager = pageManager
  }

  async start(): Promise<void> {
    const autoGradeId = this.#pageManager.getQuestion().getAutoGradeId()
    const isActive = await quizClient.isAutoGradeActive(autoGradeId)
    announcer.announceLog(this, `auto grade ${isActive ? 'active' : 'not active'}`, autoGradeId)

    if (isActive) {
      const grade = getAutoGrade(this.#pageManager.getMaxMark())
      this.#pageManager.setGrade(grade)
      announcer.announceLog(this, `grade: ${grade}`)

      await quizClient.endAutoGrade(autoGradeId)

      announcer.announceLog(this, 'submitting')
      this.#pageManager.submit()
    }
  }
}
