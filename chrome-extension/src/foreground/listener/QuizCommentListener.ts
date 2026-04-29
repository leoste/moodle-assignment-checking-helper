import { QuizDataClient } from '../quiz/client/quiz-client'
import { getManualGradedBox, getGradeInput, getMaxMark, getSubmitButton, getAutoGradeId } from '../quiz/helper/moodle-helper'
import BaseListener from './BaseListener'

class QuizCommentListener extends BaseListener {

    onPageLoad() {
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

            client.endAutoGrade(autoGradeId)

            getSubmitButton().click()
        }
    }
}

export const quizCommentListener = new QuizCommentListener()