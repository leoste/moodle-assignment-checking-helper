import { createAndAddChildElement } from '../../shared/util/element-creation-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import { quizClient } from '../client/QuizClient'
import QuizReviewPage from '../pagemanager/QuizReviewPage'
import type QuizQuestionBox from '../pagemanager/QuizQuestionBox'

class QuizReviewListener extends BaseMoodlePageListener<QuizReviewPage> {

    protected createPage(): QuizReviewPage {
        return new QuizReviewPage()
    }

    protected async onPageLoad(page: QuizReviewPage) {
        this.#createAutoGradeButtons(page)
    }

    #createAutoGradeButtons(page: QuizReviewPage) {
        void page.getQuizId()
        // TODO: use quizid and questionid to fetch newly added QuizFeedback
        // implement sidepanel similar like on assignments with my custom controls
        // print question number + common answers as buttons into sidepanel
        // when pressed, automatically assign answer and points.
        // this probably doesnt need the combination of multiple common answers into one
        // two types of feedback need to be implemented. 1) assignmentfeedback 2) quizfeedback

        page.getManualGradedQuestions().forEach(question => {
            const button = createAndAddChildElement(question.getCommentElement(), 'button', 'auto-max-button', 'Assign max points with no comment')
            button.addEventListener('click', () => this.#onClickCallback(question))
        })
    }

    #onClickCallback = async (question: QuizQuestionBox): Promise<void> => {
        const autoGradeId = question.getAutoGradeId()

        console.log(autoGradeId)

        await quizClient.beginAutoGrade(autoGradeId)

        console.log("meh")

        question.openCommentPage()
    }
}

export const quizReviewListener = new QuizReviewListener()
