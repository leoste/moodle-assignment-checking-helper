function getManualGradedBoxes() {
  return document.querySelectorAll("div.manualgraded.complete")
}

function getCommentFromManualGradedBox(box) {
  return box.querySelector("div.comment")
}

function getCommentActionLink(comment) {
  return comment.querySelector("div.commentlink a")
}