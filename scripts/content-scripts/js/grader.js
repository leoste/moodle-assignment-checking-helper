setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  setupCommentSection()
}

function setupCommentSection() {
  const commentLink = document.querySelector("a.comment-link")

  expandCommentSection(commentLink)
  insertCommonAnswerSection(commentLink)
}

function expandCommentSection(commentLink) {  
  commentLink.click()
}

function insertCommonAnswerSection(commentLink) {
  const commonAnswerSection = createCommonAnswerSection()
  commentLink.parentNode.insertBefore(commonAnswerSection, commentLink.nextSibling)
}

function createCommonAnswerSection() {
  const section = createElementWithClasses("div", ["common-answer-section"])
  
  createAndAddChildElement(section, "h2", null, "Tüüpvastused")
  const list = createAndAddChildElement(section, "ul", "common-answer-list")

  commonAnswers.forEach(commonAnswer => {
    const item = createAndAddChildElement(list, "li", "common-answer-list-item")
    const container = createAndAddChildElement(item, "div", "item-container")
    const textSection = createAndAddChildElement(container, "div", "text-section", commonAnswer.text)
    const buttonsSection = createAndAddChildElement(container, "div", "buttons-section")
    const addButton = createAndAddChildImage(buttonsSection, "images/laughing-pointing-emoji.png", ["add-button", "inactive"])

    addButton.addEventListener('click', () => {
      addButton.classList.toggle('active')
      addButton.classList.toggle('inactive')
    })
  })
  
  return section
}

const commonAnswers = [
  
]