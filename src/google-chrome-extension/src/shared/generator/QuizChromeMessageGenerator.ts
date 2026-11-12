import ChromeMessageGenerator from './ChromeMessageGenerator'
import {
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
} from '../constants/messages'
import type { AutoGradeId } from '../types/AutoGradeId'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { AutoGradeIdPayload } from '../types/AutoGradeIdPayload'

class QuizChromeMessageGenerator extends ChromeMessageGenerator {
  getBeginAutoGradeMessage(autoGradeId: AutoGradeId): ChromeMessage<AutoGradeIdPayload> {
    return this.makeMessage(QUIZ_AUTO_GRADE_BEGIN, { autoGradeId })
  }

  getEndAutoGradeMessage(autoGradeId: AutoGradeId): ChromeMessage<AutoGradeIdPayload> {
    return this.makeMessage(QUIZ_AUTO_GRADE_END, { autoGradeId })
  }

  getIsAutoGradeActiveMessage(autoGradeId: AutoGradeId): ChromeMessage<AutoGradeIdPayload> {
    return this.makeMessage(QUIZ_AUTO_GRADE_IS_ACTIVE, { autoGradeId })
  }
}

export const quizChromeMessageGenerator = new QuizChromeMessageGenerator()
