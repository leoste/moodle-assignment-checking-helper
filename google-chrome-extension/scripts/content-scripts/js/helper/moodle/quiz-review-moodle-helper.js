function getManualGradedBoxes() {
  return document.querySelectorAll("div.manualgraded.complete")
}

function getCommentFromManualGradedBox(box) {
  return box.querySelector("div.comment")
}

function getCommentActionLink(comment) {
  return comment.querySelector("div.commentlink a")
}

function getQuizId() {
  const element = document.querySelector('div.submitbtns a.mod_quiz-next-nav');
  const url = new URL(element.href);
  return url.searchParams.get('id');
}