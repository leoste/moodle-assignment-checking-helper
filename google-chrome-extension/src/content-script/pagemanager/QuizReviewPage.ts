import QuizPage from './QuizPage'
import type QuizQuestionBox from './QuizQuestionBox'

const NEXT_NAV_LINK_SELECTOR = 'div.submitbtns a.mod_quiz-next-nav'
const QUIZ_ID_PARAM = 'id'

export default class QuizReviewPage extends QuizPage {
  getManualGradedQuestions(): QuizQuestionBox[] {
    return this.getManualGradedBoxes()
  }

  getQuizId(): string {
    const element = document.querySelector<HTMLAnchorElement>(NEXT_NAV_LINK_SELECTOR)!
    return new URL(element.href).searchParams.get(QUIZ_ID_PARAM) ?? ''
  }
}
