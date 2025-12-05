setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  setupCommentSection()
  setupQuickSubmit()
  autofillGrade100()
  sendStudentName()
}

async function setupCommentSection() {
  const assignmentId = getAssignmentId()
  const fetcher = new CommonAnswersFetcher()
  const commonAnswers = await fetcher.getData(assignmentId)
  const creator = new CommentSectionCreator()
  creator.setCommonAnswers(commonAnswers)
  creator.createCommentSection()
}

async function setupQuickSubmit() {
  const commentLink = getCommentLink()
  const myDiv = createAndAddChildElement(commentLink.parentNode, "div", ["quick-submit-section"])
  const img = createAndAddChildImage(myDiv, "images/double-thumbs-up-emoji.png")
  img.addEventListener('click', () => {
    // this also automatically submits the comment
    getSaveGradeAndShowNextButton().click()
  }, {
    once: true
  })
}

async function autofillGrade100() {
  const input = getGradeInput()
  input.value = 100
}

async function sendStudentName() {
  const studentName = getStudentName()
  const client = new PageInfoClient()
  const response = await client.postStudentName(studentName)
  console.log(response)
}

class CommentSectionCreator {
  
  #commonAnswers

  setCommonAnswers(commonAnswers) {
    this.#commonAnswers = commonAnswers
  }

  createCommentSection() {
    const commentLink = getCommentLink()
    this.#expandCommentSection(commentLink)
    this.#insertCommonAnswerSection(commentLink)
  }
  
  #expandCommentSection(commentLink) {  
    commentLink.click()
  }
  
  #insertCommonAnswerSection(commentLink) {
    const creator = new CommonAnswerSectionCreator()
    creator.setParameters(getCommentTextarea(), this.#commonAnswers)  
    const commonAnswerSection = creator.createCommonAnswerSection()
    commentLink.parentNode.insertBefore(commonAnswerSection, commentLink.nextSibling)
  }
}

class CommonAnswerSectionCreator {
  
  #commonAnswers
  #list
  #commentTextarea

  setParameters(commentTextarea, commonAnswers) {
    this.#commentTextarea = commentTextarea
    this.#commonAnswers = commonAnswers
  }
  
  createCommonAnswerSection() {
    const section = createElementWithClasses("div", ["common-answer-section"])  
    createAndAddChildElement(section, "h2", null, "Tüüpvastused")
    this.#list = createAndAddChildElement(section, "ul", "common-answer-list")  
    this.#commonAnswers.forEach(this.#createCommonAnswerItem)
    this.#updateCommentText()
    return section
  }

  #createCommonAnswerItem = (commonAnswer) => {
    const creator = new CommonAnswerItemCreator()
    creator.setParameters(this.#list, commonAnswer)
    creator.setCommonAnswerUpdatedCallback(this.#commonAnswerUpdatedCallback)
    creator.createCommonAnswerItem()
  }

  #commonAnswerUpdatedCallback = () => {
    this.#updateCommentText()
  }

  #updateCommentText() {
    const text = this.#getCommonAnswerString()
    this.#commentTextarea.value = text
  }

  #getCommonAnswerString() {
    const enabledTexts = this.#commonAnswers
      .filter(answer => answer.enabled)
      .map(answer => answer.text)
    const combinedText = enabledTexts.join('\n')
    return combinedText
  }
}

class CommonAnswerItemCreator {

  #list
  #commonAnswer
  #commonAnswerUpdatedCallback

  #addButton
  #buttonsSection
  
  setParameters(list, commonAnswer) {
    this.#list = list
    this.#commonAnswer = commonAnswer
  }

  setCommonAnswerUpdatedCallback(callback) {
    this.#commonAnswerUpdatedCallback = callback
  }

  createCommonAnswerItem() {
    const item = createAndAddChildElement(this.#list, "li", "common-answer-list-item")
    const container = createAndAddChildElement(item, "div", "item-container")
    const textSection = createAndAddChildElement(container, "div", "text-section", this.#commonAnswer.text)
    this.#buttonsSection = createAndAddChildElement(container, "div", "buttons-section")
    this.createAddButton()
  }

  createAddButton() {
    const classList = ["add-button"]
    const extraClass = this.#commonAnswer.enabled ? "active" : "inactive"
    classList.push(extraClass)
    this.#addButton = createAndAddChildImage(this.#buttonsSection, "images/laughing-pointing-emoji.png", classList)
    this.#addButton.addEventListener('click', this.#addButtonOnClick)
  }
  
  #addButtonOnClick = () => {
    this.#toggleCommonAnswer()
  }

  #toggleCommonAnswer() {
    const newState = !this.#commonAnswer.enabled
    this.#commonAnswer.enabled = newState
    this.#addButton.classList.toggle('active', newState)
    this.#addButton.classList.toggle('inactive', !newState)
    this.#commonAnswerUpdatedCallback()
  }
}