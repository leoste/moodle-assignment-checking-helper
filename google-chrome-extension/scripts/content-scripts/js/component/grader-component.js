class CheckingHelperPanelRenderer {

  constructor() {
    console.log("uus constructor mehed")
    this.#gradeCreator = new GradeSectionCreator()
    this.#commentCreator = new CommentSectionCreator()
  }

  #mainDiv
  #gradeCreator
  #commentCreator

  async render() {
    this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel() {
    this.#mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    const element = createElementWithClasses("div", ["checking-helper-panel"])
    this.#mainDiv.insertBefore(element, gradePanel.nextSibling)
    
    const leftDiv = createAndAddChildElement(element, "div", ["grade-subpanel", "checking-helper-subpanel"])
    const rightDiv = createAndAddChildElement(element, "div", ["common-answer-subpanel", "checking-helper-subpanel"])

    this.#setupGradeSection(leftDiv)
    this.#setupCommentSection(rightDiv)
  }

  async #setupGradeSection(parentDiv) {
    createAndAddChildElement(parentDiv, "h2", null, "Hinde kujunemine")

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new GradePartsFetcher()
    const data = await fetcher.getData(assignmentId)    
    this.#gradeCreator.setParentElement(parentDiv)
    this.#gradeCreator.setGradeParts(data)
    this.#gradeCreator.create()
  }

  async #setupCommentSection(parentDiv) {
    createAndAddChildElement(parentDiv, "h2", null, "Kommentaari koostamine")

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new CommonAnswersFetcher()
    const data = await fetcher.getData(assignmentId)    
    this.#commentCreator.setParentElement(parentDiv)
    this.#commentCreator.setCommonAnswers(data)
    this.#commentCreator.create()
  }
}

class CommentSectionCreator extends ClickableList {
  
  #commonAnswers
  #commentTextarea

  setCommonAnswers(commonAnswers) {
    this.#commonAnswers = commonAnswers
  }

  create() {
    this.#commentTextarea = getCommentTextarea()
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

  setParentElement(parentElement) {
    this.#parentElement = parentElement
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
    this.#gradeInput = getGradeInput()
    this.#gradeParts.forEach(gradePart => {
      this.createSubsectionList(gradePart)
    })
  }

  createSubsectionList(gradePart) {
    const list = new ClickableList()
    list.setParentElement(this.#parentElement)

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
