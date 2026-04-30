import { getStudentName } from '../pagemanager/assignment-moodle-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import PageInfoClient from '../client/PageInfoClient'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'

class AssignmentGraderListener extends BaseMoodlePageListener {

    onPageLoad() {
        new CheckingHelperPanelRenderer().render()
        this.#sendStudentName()
    }

    async #sendStudentName() {
        const studentName = getStudentName()
        const client = new PageInfoClient()
        const response = await client.postStudentName(studentName)
        console.log(response)
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()