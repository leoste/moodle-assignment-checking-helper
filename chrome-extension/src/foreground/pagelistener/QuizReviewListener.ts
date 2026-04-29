import { getManualGradedBoxes, getCommentFromManualGradedBox, getAutoGradeId, getCommentActionLink, getQuizId } from '../pagemanager/quiz-moodle-helper'
import { createAndAddChildElement } from '../pagemanager/quiz-element-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizDataClient from '../client/QuizClient'

class QuizReviewListener extends BaseMoodlePageListener {

    onPageLoad() {
        this.#createAutoGradeButtons()
    }

    #createAutoGradeButtons() {
        void getQuizId()
        // TODO: use quizid and questionid to fetch common answers
        // implement sidepanel similar like on assignments with my custom controls
        // print question number + common answers as buttons into sidepanel
        // when pressed, automatically assign answer and points.
        // this probably doesnt need the combination of multiple common answers into one
        // split commonanswers into assignment and quiz separately as theyre different

        const graderBoxes = getManualGradedBoxes()

        graderBoxes.forEach(box => {
            const comment = getCommentFromManualGradedBox(box)
            const button = createAndAddChildElement(comment, 'button', 'auto-max-button', 'Assign max points with no comment')
            button.addEventListener('click', () => this.#onClickCallback(box, comment))
        })
    }

    #onClickCallback = async (box: HTMLElement, comment: HTMLElement): Promise<void> => {
        const autoGradeId = getAutoGradeId(box)

        console.log(autoGradeId)

        const client = new QuizDataClient()
        await client.beginAutoGrade(autoGradeId)

        console.log("meh")

        getCommentActionLink(comment).click()
    }
}

export const quizReviewListener = new QuizReviewListener()