import BaseMoodlePageListener from './BaseMoodlePageListener'
import { pageInfoClient } from '../client/PageInfoClient'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'
import AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'

class AssignmentGraderListener extends BaseMoodlePageListener<AssignmentGraderPage> {

    #renderer: CheckingHelperPanelRenderer | undefined

    protected createPage(): AssignmentGraderPage {
        return new AssignmentGraderPage()
    }

    protected async onPageLoad(page: AssignmentGraderPage) {
        await this.#renderer?.clear()
        this.#renderer = new CheckingHelperPanelRenderer(page)
        await this.#renderer.render()

        await this.#sendStudentName(page)
    }

    async #sendStudentName(page: AssignmentGraderPage) {
        const response = await pageInfoClient.postStudentName(page.getStudentName())
        console.log(response)
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()
