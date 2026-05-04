import { getManualGradedBoxes, getCommentFromManualGradedBox, getAutoGradeId, getCommentActionLink, getQuizId } from '../pagemanager/quiz-moodle-helper'
import { createAndAddChildElement } from '../pagemanager/element-creation-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizDataClient from '../client/QuizClient'

class QuizReviewListener extends BaseMoodlePageListener {

    async onPageLoad() {
        this.#createAutoGradeButtons()
    }

    #createAutoGradeButtons() {
        void getQuizId()
        // TODO: use quizid and questionid to fetch newly added QuizFeedback
        // implement sidepanel similar like on assignments with my custom controls
        // print question number + common answers as buttons into sidepanel
        // when pressed, automatically assign answer and points.
        // this probably doesnt need the combination of multiple common answers into one
        // two types of feedback need to be implemented. 1) assignmentfeedback 2) quizfeedback

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