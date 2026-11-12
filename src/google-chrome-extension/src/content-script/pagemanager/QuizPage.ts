import { announcer } from '@shared/announcer/Announcer'
import MoodlePage from './MoodlePage'
import QuizQuestionBox from './QuizQuestionBox'

const ATTEMPT_ID_PARAM = 'attempt'
const MANUAL_GRADED_BOX_SELECTOR = 'div.manualgraded.complete'

export default abstract class QuizPage extends MoodlePage {
  protected getManualGradedBoxes(): QuizQuestionBox[] {
    const attemptId = this.getUrlParam(ATTEMPT_ID_PARAM)
    const boxes = Array.from(document.querySelectorAll<HTMLElement>(MANUAL_GRADED_BOX_SELECTOR))
      .map(element => new QuizQuestionBox(element, attemptId))
    announcer.announceLog(this, `found ${boxes.length} manual graded question(s)`)
    return boxes
  }
}
