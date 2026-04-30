import { getStudentName } from '../pagemanager/assignment-moodle-helper'
import BaseMoodlePageListener from './BaseMoodlePageListener'
import { pageInfoClient } from '../client/PageInfoClient'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'

class AssignmentGraderListener extends BaseMoodlePageListener {

    onPageLoad() {
        new CheckingHelperPanelRenderer().render()
        this.#sendStudentName()
    }

    async #sendStudentName() {
        const studentName = getStudentName()
        const response = await pageInfoClient.postStudentName(studentName)
        console.log(response)
    }
}

export const assignmentGraderListener = new AssignmentGraderListener()