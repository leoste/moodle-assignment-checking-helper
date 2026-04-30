import type { AutoGradeId } from '../../types'
import BaseClient from './BaseClient'

export default class QuizDataClient extends BaseClient {
  static readonly #BEGIN  = 'quiz/auto-grade/begin'
  static readonly #END    = 'quiz/auto-grade/end'
  static readonly #ACTIVE = 'quiz/auto-grade/is-active'

  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(QuizDataClient.#BEGIN, { autoGradeId: id }))
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(QuizDataClient.#END, { autoGradeId: id }))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return chrome.runtime.sendMessage(this.makeMessage(QuizDataClient.#ACTIVE, { autoGradeId: id })) as Promise<boolean>
  }
}
