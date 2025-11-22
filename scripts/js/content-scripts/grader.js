setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  test()
}

function test() {
  const commentLink = document.querySelector("a.comment-link")
  commentLink.click()
}
