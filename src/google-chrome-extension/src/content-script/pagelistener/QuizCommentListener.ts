import BaseMoodlePageListener from './BaseMoodlePageListener'
import QuizCommentPage from '../pagemanager/QuizCommentPage'
import QuizCommentPresenter from '../presenter/QuizCommentPresenter'

class QuizCommentListener extends BaseMoodlePageListener<QuizCommentPage> {
    protected createPage(): QuizCommentPage {
        return new QuizCommentPage()
    }

    protected createPresenter(page: QuizCommentPage): QuizCommentPresenter {
        return new QuizCommentPresenter(page)
    }
}

export const quizCommentListener = new QuizCommentListener()
