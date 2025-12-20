function getManualGradedBox() {
  return document.querySelector("div.manualgraded.complete")
}

function getGradeInput() {
  return document.querySelector('input[id^="q"][id$="_-mark"]')
}

function getMaxMark() {
  const element = document.querySelector('input[name^="q"][name$="_-maxmark"]')
  return element.value
}

function getSubmitButton() {
  return document.querySelector('input#id_submitbutton')
}