/// <reference lib="dom" />
import type { AutoGradeId, ExtensionMessage } from '../../../types'

function makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
  return { type, content }
}

export class QuizDataClient {
  static readonly #BEGIN  = 'quiz/auto-grade/begin'
  static readonly #END    = 'quiz/auto-grade/end'
  static readonly #ACTIVE = 'quiz/auto-grade/is-active'

  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(makeMessage(QuizDataClient.#BEGIN, { autoGradeId: id }))
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(makeMessage(QuizDataClient.#END, { autoGradeId: id }))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return chrome.runtime.sendMessage(makeMessage(QuizDataClient.#ACTIVE, { autoGradeId: id })) as Promise<boolean>
  }
}
