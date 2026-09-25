import { quizClient } from '../client/QuizClient'
import { getManualGradedBox, getGradeInput, getMaxMark, getSubmitButton, getAutoGradeId } from '../pagemanager/quiz-moodle-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'

class QuizCommentListener extends BaseMoodlePageListener {

    async onPageLoad() {
        this.#autoGradeIfActive()
    }

    async #autoGradeIfActive() {
        const box = getManualGradedBox()
        const autoGradeId = getAutoGradeId(box)
        const isActive = await quizClient.isAutoGradeActive(autoGradeId)

        if (isActive) {
            const grade = getMaxMark()

            const gradeInput = getGradeInput()
            gradeInput.value = grade

            await quizClient.endAutoGrade(autoGradeId)

            getSubmitButton().click()
        }
    }
}

export const quizCommentListener = new QuizCommentListener()
