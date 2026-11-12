import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizReviewPageManager from '../manager/QuizReviewPageManager'
import QuizReviewPresenter from '../presenter/QuizReviewPresenter'

class QuizReviewPageListener extends BaseMoodlePageListener<QuizReviewPageManager> {
    protected createPageManager(): QuizReviewPageManager {
        return new QuizReviewPageManager()
    }

    protected createPresenter(pageManager: QuizReviewPageManager): QuizReviewPresenter {
        return new QuizReviewPresenter(pageManager)
    }
}

export const quizReviewPageListener = new QuizReviewPageListener()
