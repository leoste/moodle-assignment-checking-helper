import CheckingHelperPanelRenderer from '../assignment/component/CheckingHelperPanelRenderer'
import { PageInfoClient } from '../assignment/client/clients'
import { getStudentName } from '../assignment/helper/moodle-helper'
import BaseListener from './BaseListener'

class AssignmentGraderListener extends BaseListener {

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