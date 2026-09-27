import BaseMoodlePageListener from './BaseMoodlePageListener'
import AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'
import AssignmentGraderPresenter from '../presenter/AssignmentGraderPresenter'

class AssignmentGraderListener extends BaseMoodlePageListener<AssignmentGraderPage> {
    protected createPage(): AssignmentGraderPage {
        return new AssignmentGraderPage()
    }

    protected createPresenter(page: AssignmentGraderPage): AssignmentGraderPresenter {
        return new AssignmentGraderPresenter(page)
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()
