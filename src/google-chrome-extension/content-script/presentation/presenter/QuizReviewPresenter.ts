import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import type QuizReviewPageManager from '../manager/QuizReviewPageManager'
import type QuizQuestionBox from '../manager/QuizQuestionBox'
import { AutoGradeButtonRenderer } from '../renderer/AutoGradeButtonRenderer'
import { quizClient } from '../../communication/client/QuizClient'
import { announcer } from '@shared/communication/announcer/Announcer'

export default class QuizReviewPresenter extends BasePresenter {
  readonly #pageManager: QuizReviewPageManager

  #renderers: AutoGradeButtonRenderer[] = []

  constructor(pageManager: QuizReviewPageManager) {
    super()
    this.#pageManager = pageManager
  }

  async start(): Promise<void> {
    for (const question of this.#pageManager.getManualGradedQuestions()) {
      const renderer = new AutoGradeButtonRenderer(question.getCommentElement(), () => this.#onAutoGradeClick(question))
      this.#renderers.push(renderer)
      await renderer.render()
    }
  }

  async stop(): Promise<void> {
    for (const renderer of this.#renderers) {
      await renderer.clear()
    }
    this.#renderers = []
  }

  async #onAutoGradeClick(question: QuizQuestionBox): Promise<void> {
    const autoGradeId = question.getAutoGradeId()
    announcer.announceLog(this, 'beginning auto grade', autoGradeId)

    await quizClient.beginAutoGrade(autoGradeId)
    announcer.announceLog(this, 'auto grade begun, opening comment page')

    question.openCommentPage()
  }
}
