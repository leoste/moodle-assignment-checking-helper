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
