import BaseMoodlePageListener from './BaseMoodlePageListener'
import AssignmentGraderPageManager from '../manager/AssignmentGraderPageManager'
import AssignmentGraderPresenter from '../presenter/AssignmentGraderPresenter'

class AssignmentGraderPageListener extends BaseMoodlePageListener<AssignmentGraderPageManager> {
    #presenter: AssignmentGraderPresenter | undefined

    async refreshDefinition(): Promise<void> {
        await this.#presenter?.refreshDefinition()
    }

    protected createPageManager(): AssignmentGraderPageManager {
        return new AssignmentGraderPageManager()
    }

    protected createPresenter(pageManager: AssignmentGraderPageManager): AssignmentGraderPresenter {
        this.#presenter = new AssignmentGraderPresenter(pageManager)
        return this.#presenter
    }
}

export const assignmentGraderPageListener = new AssignmentGraderPageListener()
