class CommentSectionCreator extends ClickableList {
  
  #commonAnswers
  #commentTextarea

  constructor(parentElement) {
    super(parentElement)
    this.#commentTextarea = getCommentTextarea()
  }

  setCommonAnswers(commonAnswers) {
    this.#commonAnswers = commonAnswers
  }

  create() {    
    this.#expandCommentSection()

    this.properties = {
      sectionDivClass: "common-answer-section",
      sectionTitle: "Tüüpvastused",
      listItemClass: "common-answer-list"
    }
    this.items = this.#commonAnswers
    this.onClickCallback = this.#onClickCallback

    this.createContent()
  }

  #onClickCallback = (states) => {
    this.#updateCommentText(states)
  }

  #updateCommentText(states) {
    const text = this.#getCommonAnswerString(states)
    this.#commentTextarea.value = text
  }

  #getCommonAnswerString(states) {
    const enabledTexts = states
      .filter(answer => answer.enabled)
      .map(answer => answer.text)
    const combinedText = enabledTexts.join('\n')
    return combinedText
  }
  
  #expandCommentSection() {  
    const commentLink = getCommentLink()
    commentLink.click()
  }
}

class GradeSectionCreator {
  
  #gradeParts
  #parentElement

  constructor(parentElement) {
    this.#parentElement = parentElement
  }

  setGradeParts(gradeParts) {
    this.#gradeParts = gradeParts
  }

  create() {
    this.#gradeParts.forEach(gradePart => {
      this.createSubsectionList(gradePart)
    })
  }

  createSubsectionList(gradePart) {
    const list = new ClickableList(this.#parentElement)

    list.properties = {
      sectionDivClass: "common-answer-section",
      sectionTitle: `${gradePart.title} (${gradePart.max.points}p)`,
      listItemClass: "common-answer-list"
    }
    list.items = gradePart.parts
    list.onClickCallback = this.#onClickCallback
    list.createContent()
  }

  #onClickCallback = (states) => {
    console.log(states)
  }
}
