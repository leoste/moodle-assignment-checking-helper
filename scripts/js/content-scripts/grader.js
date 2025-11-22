setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  expandCommentSection()
}

function expandCommentSection() {
  const commentLink = document.querySelector("a.comment-link")
  commentLink.click()
}
