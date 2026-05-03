import QuizDataClient from '../client/QuizClient'
import { getManualGradedBox, getGradeInput, getMaxMark, getSubmitButton, getAutoGradeId } from '../pagemanager/quiz-moodle-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'

class QuizCommentListener extends BaseMoodlePageListener {

    async onPageLoad() {
        this.#autoGradeIfActive()
    }

    async #autoGradeIfActive() {
        const client = new QuizDataClient()

        const box = getManualGradedBox()
        const autoGradeId = getAutoGradeId(box)
        const isActive = await client.isAutoGradeActive(autoGradeId)

        if (isActive) {
            const grade = getMaxMark()

            const gradeInput = getGradeInput()
            gradeInput.value = grade

            await client.endAutoGrade(autoGradeId)

            getSubmitButton().click()
        }
    }
}

export const quizCommentListener = new QuizCommentListener()
