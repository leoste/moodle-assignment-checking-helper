import MoodlePage from './MoodlePage'
import QuizQuestionBox from './QuizQuestionBox'

const ATTEMPT_ID_PARAM = 'attempt'
const MANUAL_GRADED_BOX_SELECTOR = 'div.manualgraded.complete'

export default abstract class QuizPage extends MoodlePage {
  protected getManualGradedBoxes(): QuizQuestionBox[] {
    const attemptId = this.getUrlParam(ATTEMPT_ID_PARAM)
    return Array.from(document.querySelectorAll<HTMLElement>(MANUAL_GRADED_BOX_SELECTOR))
      .map(element => new QuizQuestionBox(element, attemptId))
  }
}
