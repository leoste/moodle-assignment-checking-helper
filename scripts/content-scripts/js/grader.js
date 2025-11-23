setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  setupCommentSection()
}

function setupCommentSection() {
  const commentLink = getCommentLink()
  expandCommentSection(commentLink)
  insertCommonAnswerSection(commentLink)
}

function expandCommentSection(commentLink) {  
  commentLink.click()
}

function insertCommonAnswerSection(commentLink) {
  const creator = new CommonAnswerSectionCreator()
  creator.setParameters(getCommentTextarea())  
  const commonAnswerSection = creator.createCommonAnswerSection()
  commentLink.parentNode.insertBefore(commonAnswerSection, commentLink.nextSibling)
}

class CommonAnswerSectionCreator {
  
  #commonAnswers = [
    {
      "text":"Well done",
      "enabled":false
    },
    {
      "text":"No additional comments",
      "enabled":false
    }
  ]
  #list
  #commentTextarea

  setParameters(commentTextarea) {
    this.#commentTextarea = commentTextarea
  }
  
  createCommonAnswerSection() {
    const section = createElementWithClasses("div", ["common-answer-section"])  
    createAndAddChildElement(section, "h2", null, "Tüüpvastused")
    this.#list = createAndAddChildElement(section, "ul", "common-answer-list")
  
    this.#commonAnswers.forEach(this.#createCommonAnswerItem)
    
    return section
  }

  #createCommonAnswerItem = (commonAnswer) => {
    const creator = new CommonAnswerItemCreator()
    creator.setParameters(this.#list, commonAnswer)
    creator.setCommonAnswerUpdatedCallback(this.#commonAnswerUpdatedCallback)
    creator.createCommonAnswerItem()
  }

  #commonAnswerUpdatedCallback = () => {
    const text = this.#getCommonAnswerString()
    console.log("section builder", this.#commonAnswers, text)
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
    const buttonsSection = createAndAddChildElement(container, "div", "buttons-section")
    this.#addButton = createAndAddChildImage(buttonsSection, "images/laughing-pointing-emoji.png", ["add-button", "inactive"])  
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
    console.log("item builder", this.#commonAnswer, newState)
    this.#commonAnswerUpdatedCallback()
  }
}