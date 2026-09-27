import { quizClient } from '../client/QuizClient'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizCommentPage from '../pagemanager/QuizCommentPage'

class QuizCommentListener extends BaseMoodlePageListener<QuizCommentPage> {

    protected createPage(): QuizCommentPage {
        return new QuizCommentPage()
    }

    protected async onPageLoad(page: QuizCommentPage) {
        this.#autoGradeIfActive(page)
    }

    async #autoGradeIfActive(page: QuizCommentPage) {
        const autoGradeId = page.getQuestion().getAutoGradeId()
        const isActive = await quizClient.isAutoGradeActive(autoGradeId)

        if (isActive) {
            page.setGrade(page.getMaxMark())

            await quizClient.endAutoGrade(autoGradeId)

            page.submit()
        }
    }
}

export const quizCommentListener = new QuizCommentListener()
