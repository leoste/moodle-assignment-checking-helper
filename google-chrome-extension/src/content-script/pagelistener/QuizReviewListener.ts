import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizReviewPage from '../pagemanager/QuizReviewPage'
import QuizReviewPresenter from '../presenter/QuizReviewPresenter'

class QuizReviewListener extends BaseMoodlePageListener<QuizReviewPage> {
    protected createPage(): QuizReviewPage {
        return new QuizReviewPage()
    }

    protected createPresenter(page: QuizReviewPage): QuizReviewPresenter {
        return new QuizReviewPresenter(page)
    }
}

export const quizReviewListener = new QuizReviewListener()
