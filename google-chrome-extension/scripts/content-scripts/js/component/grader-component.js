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
  #gradeInput

  constructor(parentElement, gradeInput) {
    this.#parentElement = parentElement
    this.#gradeInput = gradeInput
  }

  setGradeParts(gradeParts) {
    this.#gradeParts = deepCopy(gradeParts)

    let idCounter = 0
    this.#gradeParts.forEach(part => {
      part._id = ++idCounter
      part.parts.forEach(partPart => {
        partPart.text = `${partPart.text} (${partPart.points}p)`
      })
    })
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
    list.onClickCallback = (states) => this.#onClickCallback(states, gradePart._id)
    list.createContent()
  }

  #onClickCallback = (states, id) => {
    const gradePart = this.#gradeParts.find(p => p._id === id)
    gradePart.parts = states

    this.#calculateAndSetTotalPoints()
  }

  #calculateAndSetTotalPoints() {
    const totalPoints = this.#gradeParts.reduce((sum, major) => {
      const partSum = (major.parts || []).reduce((ps, p) => ps + ((p.enabled) ? (p.points || 0) : 0), 0)
      return sum + partSum
    }, 0)
    this.#gradeInput.value = totalPoints
  }
}
