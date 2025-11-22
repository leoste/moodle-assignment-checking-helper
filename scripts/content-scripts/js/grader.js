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
  
  createAndAddChildElement(section, "h2", "Tüüpvastused")
  
  return section
}
