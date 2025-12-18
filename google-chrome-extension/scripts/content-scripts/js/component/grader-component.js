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

  createCommentSection() {    
    this.#expandCommentSection()

    this._protectedProperties = {
      sectionDivClass: "common-answer-section",
      sectionTitle: "Tüüpvastused",
      listItemClass: "common-answer-list"
    }
    this._protectedItems = this.#commonAnswers
    this._protectedOnClickCallback = this.#onClickCallback

    this._protectedCreateContent()
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

