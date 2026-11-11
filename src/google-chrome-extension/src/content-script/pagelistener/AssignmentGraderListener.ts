import BaseMoodlePageListener from './BaseMoodlePageListener'
import AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'
import AssignmentGraderPresenter from '../presenter/AssignmentGraderPresenter'

class AssignmentGraderListener extends BaseMoodlePageListener<AssignmentGraderPage> {
    #presenter: AssignmentGraderPresenter | undefined

    async refreshDefinition(): Promise<void> {
        await this.#presenter?.refreshDefinition()
    }

    protected createPage(): AssignmentGraderPage {
        return new AssignmentGraderPage()
    }

    protected createPresenter(page: AssignmentGraderPage): AssignmentGraderPresenter {
        this.#presenter = new AssignmentGraderPresenter(page)
        return this.#presenter
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()
