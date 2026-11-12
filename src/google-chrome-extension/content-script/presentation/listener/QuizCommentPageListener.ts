import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizCommentPageManager from '../manager/QuizCommentPageManager'
import QuizCommentPresenter from '../presenter/QuizCommentPresenter'

class QuizCommentPageListener extends BaseMoodlePageListener<QuizCommentPageManager> {
    protected createPageManager(): QuizCommentPageManager {
        return new QuizCommentPageManager()
    }

    protected createPresenter(pageManager: QuizCommentPageManager): QuizCommentPresenter {
        return new QuizCommentPresenter(pageManager)
    }
}

export const quizCommentPageListener = new QuizCommentPageListener()
