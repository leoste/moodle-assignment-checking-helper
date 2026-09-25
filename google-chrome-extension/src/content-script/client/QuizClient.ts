import type { AutoGradeId } from '../../shared/types/AutoGradeId'
import ChromeExtensionMessageClient from '../../shared/client/ChromeExtensionMessageClient'
import {
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
} from '../../shared/constants/messages'

export default class QuizClient extends ChromeExtensionMessageClient {
  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(QUIZ_AUTO_GRADE_BEGIN, { autoGradeId: id }))
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await chrome.runtime.sendMessage(this.makeMessage(QUIZ_AUTO_GRADE_END, { autoGradeId: id }))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return chrome.runtime.sendMessage(this.makeMessage(QUIZ_AUTO_GRADE_IS_ACTIVE, { autoGradeId: id })) as Promise<boolean>
  }
}
