import type { AutoGradeId } from '../../../shared/business/types/AutoGradeId'
import ChromeMessageClient from '../../../shared/communication/client/ChromeMessageClient'
import { quizChromeMessageGenerator } from '../../../shared/foundation/generator/QuizChromeMessageGenerator'

class QuizClient extends ChromeMessageClient {
  async beginAutoGrade(id: AutoGradeId): Promise<void> {
    await this.send(quizChromeMessageGenerator.getBeginAutoGradeMessage(id))
  }

  async endAutoGrade(id: AutoGradeId): Promise<void> {
    await this.send(quizChromeMessageGenerator.getEndAutoGradeMessage(id))
  }

  async isAutoGradeActive(id: AutoGradeId): Promise<boolean> {
    return this.send<boolean>(quizChromeMessageGenerator.getIsAutoGradeActiveMessage(id))
  }
}

export const quizClient = new QuizClient()
