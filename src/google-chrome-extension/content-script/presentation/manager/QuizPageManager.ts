import { announcer } from '@shared/communication/announcer/Announcer'
import MoodlePageManager from './MoodlePageManager'
import QuizQuestionBox from './QuizQuestionBox'

const ATTEMPT_ID_PARAM = 'attempt'
const MANUAL_GRADED_BOX_SELECTOR = 'div.manualgraded.complete'

export default abstract class QuizPageManager extends MoodlePageManager {
  protected getManualGradedBoxes(): QuizQuestionBox[] {
    const attemptId = this.getUrlParam(ATTEMPT_ID_PARAM)
    const boxes = Array.from(document.querySelectorAll<HTMLElement>(MANUAL_GRADED_BOX_SELECTOR))
      .map(element => new QuizQuestionBox(element, attemptId))
    announcer.announceLog(this, `found ${boxes.length} manual graded question(s)`)
    return boxes
  }
}
