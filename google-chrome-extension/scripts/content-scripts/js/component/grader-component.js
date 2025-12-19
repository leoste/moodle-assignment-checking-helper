class CheckingHelperPanelRenderer {

  constructor() {
    console.log("uus constructor mehed")
    this.#gradeManager = new GradeSectionManager()
    this.#commentManager = new CommentSectionManager()
  }

  #checkingHelperPanel
  #gradeManager
  #commentManager

  async render() {
    this.#gradeManager.destroy()
    this.#commentManager.destroy()
    this.#checkingHelperPanel?.remove()
    this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel() {
    const mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    this.#checkingHelperPanel = createElementWithClasses("div", ["checking-helper-panel"])
    mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling)
    
    const leftDiv = createAndAddChildElement(this.#checkingHelperPanel, "div", ["grade-subpanel", "checking-helper-subpanel"])
    const rightDiv = createAndAddChildElement(this.#checkingHelperPanel, "div", ["common-answer-subpanel", "checking-helper-subpanel"])

    this.#setupGradeSection(leftDiv)
    this.#setupCommentSection(rightDiv)
  }

  async #setupGradeSection(parentDiv) {
    createAndAddChildElement(parentDiv, "h2", null, "Hinde kujunemine")

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new GradePartsFetcher()
    const data = await fetcher.getData(assignmentId)    
    this.#gradeManager.setParentElement(parentDiv)
    this.#gradeManager.setGradeParts(data)
    this.#gradeManager.create()
  }

  async #setupCommentSection(parentDiv) {
    createAndAddChildElement(parentDiv, "h2", null, "Kommentaari koostamine")

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new CommonAnswersFetcher()
    const data = await fetcher.getData(assignmentId)    
    this.#commentManager.setParentElement(parentDiv)
    this.#commentManager.setCommonAnswers(data)
    this.#commentManager.create()
  }
}

// TODO: Instead of extending, use it internally

class CommentSectionManager {
  
  #commonAnswers
  #commentTextarea
  #parentElement

  setParentElement(parentElement) {
    this.#parentElement = parentElement
  }

  setCommonAnswers(commonAnswers) {
    this.#commonAnswers = commonAnswers
  }

  create() {
    const listManager = new ClickableListManager()
    listManager.setParentElement(this.#parentElement)

    this.#commentTextarea = getCommentTextarea()
    this.#expandCommentSection()

    const properties = {
      sectionDivClass: "common-answer-section",
      sectionTitle: "Tüüpvastused",
      listItemClass: "common-answer-list"
    }
    const items = this.#commonAnswers
    const onClickCallback = this.#onClickCallback

    listManager.setParameters(onClickCallback, items, properties)

    listManager.create()
  }

  destroy() {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
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

class GradeSectionManager {
  
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

  destroy() {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
  }

  createSubsectionList(gradePart) {
    const listManager = new ClickableListManager()
    listManager.setParentElement(this.#parentElement)

    const properties = {
      sectionDivClass: "common-answer-section",
      sectionTitle: `${gradePart.title} (${gradePart.max.points}p)`,
      listItemClass: "common-answer-list"
    }
    const items = gradePart.parts
    const onClickCallback = (states) => this.#onClickCallback(states, gradePart._id)

    listManager.setParameters(onClickCallback, items, properties)
    
    listManager.create()
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
