import { getStudentName } from '../pagemanager/assignment-moodle-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import { pageInfoClient } from '../client/PageInfoClient'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'

class AssignmentGraderListener extends BaseMoodlePageListener {

    static #renderer: CheckingHelperPanelRenderer | null

    async onPageLoad() {
        if (!AssignmentGraderListener.#renderer) {
            AssignmentGraderListener.#renderer = new CheckingHelperPanelRenderer()
        }

        await AssignmentGraderListener.#renderer.clear()
        await AssignmentGraderListener.#renderer.render()
        
        await this.#sendStudentName()
    }

    async #sendStudentName() {
        const studentName = getStudentName()
        const response = await pageInfoClient.postStudentName(studentName)
        console.log(response)
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()