function executeOnPageLoad(callback) {
  const observer = new PageUpdateObserver()
  observer.addCallback(callback)
}

function getCommentLink() {
  return document.querySelector("a.comment-link")
}

function getCommentTextarea() {
  return document.querySelector("div.comment-area div.db textarea")
}

function getGradeInput() {
  return document.querySelector("input#id_grade")
}

function getBottomDiv() {
  return document.querySelector('div[data-region="grade-actions"] > div:has(> form)')
}

function getSaveCommentButton() {
  return document.querySelector('a[id^="comment-action-post-"]')
}

function getSaveGradeAndShowNextButton() {
  return document.querySelector('button[name="saveandshownext"]')
}

function getAssignmentId() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  return id
}

function getStudentName() {
  const studentNameElement = document.querySelector('div[data-region="user-info"] h4 a')
  const studentName = getDirectTextContent(studentNameElement)
  return studentName
}

class PageUpdateObserver {
  
  #timeoutDuration = 1200
  #lastURL = location.href

  addCallback(callback) {
    this.#executeOnPageRefresh(callback)
    this.#executeOnPageNavigation(callback)
  }

  #executeOnPageRefresh(callback) {
    console.log("begin on page..")
    let idleTimer

    const observer = new MutationObserver(() => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        observer.disconnect()
        callback()
      }, this.#timeoutDuration)
    })

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })
  }
  
  #executeOnPageNavigation(callback) {
    setInterval(() => {
      if (location.href !== this.#lastURL) {
        this.#lastURL = location.href
        this.#executeOnPageRefresh(callback)
      }
    }, 100)
  }
}