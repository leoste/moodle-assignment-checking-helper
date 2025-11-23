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
      "text":"Well done"
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
    creator.setParameters(this.#commentTextarea, this.#list, commonAnswer)
    creator.createCommonAnswerItem()
  }
}

class CommonAnswerItemCreator {

  #commentTextarea
  #list
  #commonAnswer

  #addButton
  
  setParameters(commentTextarea, list, commonAnswer) {
    this.#commentTextarea = commentTextarea
    this.#list = list
    this.#commonAnswer = commonAnswer
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
    this.#addButton.classList.toggle('active')
    this.#addButton.classList.toggle('inactive')
    this.#commentTextarea.value = "."
  }
}