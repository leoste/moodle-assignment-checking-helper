import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import type QuizCommentPageManager from '../manager/QuizCommentPageManager'
import { quizClient } from '../../communication/client/QuizClient'
import { getAutoGrade } from '../../business/rules/quiz-rules'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'

export default class QuizCommentPresenter extends BasePresenter {
  readonly #pageManager: QuizCommentPageManager

  constructor(pageManager: QuizCommentPageManager) {
    super()
    this.#pageManager = pageManager
  }

  async start(): Promise<void> {
    const autoGradeId = this.#pageManager.getQuestion().getAutoGradeId()
    const isActive = await quizClient.isAutoGradeActive(autoGradeId)
    logAnnouncer.announceLog(this, `auto grade ${isActive ? 'active' : 'not active'}`, autoGradeId)

    if (isActive) {
      const grade = getAutoGrade(this.#pageManager.getMaxMark())
      this.#pageManager.setGrade(grade)
      logAnnouncer.announceLog(this, `grade: ${grade}`)

      await quizClient.endAutoGrade(autoGradeId)

      logAnnouncer.announceLog(this, 'submitting')
      this.#pageManager.submit()
    }
  }
}
