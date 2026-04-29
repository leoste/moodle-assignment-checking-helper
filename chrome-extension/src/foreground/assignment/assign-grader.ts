import CheckingHelperPanelRenderer from './component/CheckingHelperPanelRenderer'
import { PageInfoClient } from './client/clients'
import { executeOnPageLoad, getStudentName } from './helper/moodle-helper'

const renderer = new CheckingHelperPanelRenderer()

setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  renderer.render()
  sendStudentName()
}

async function sendStudentName() {
  const studentName = getStudentName()
  const client = new PageInfoClient()
  const response = await client.postStudentName(studentName)
  console.log(response)
}
