function executeOnPageLoad(callback) {
  let idleTimer

  const observer = new MutationObserver(() => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      observer.disconnect()
      callback()
    }, 1200)
  })

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  })
}

function getCommentLink() {
  return document.querySelector("a.comment-link")
}

function getCommentTextarea() {
  return document.querySelector("div.comment-area div.db textarea")
}

function getAssignmentId() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  console.log(id)
  return id
}