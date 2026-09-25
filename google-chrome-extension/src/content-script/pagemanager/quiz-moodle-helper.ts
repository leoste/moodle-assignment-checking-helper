import type { AutoGradeId } from '../../shared/types/AutoGradeId'

// Moodle's manual graded box id format: "question-<quiz id>-<question number>"
const MANUAL_GRADED_BOX_ID_SEPARATOR = '-'
const MANUAL_GRADED_BOX_ID_QUIZ_ID_INDEX = 1
const MANUAL_GRADED_BOX_ID_QUESTION_NUMBER_INDEX = 2

export function getManualGradedBox(): HTMLElement {
  return document.querySelector<HTMLElement>('div.manualgraded.complete')!
}

export function getGradeInput(): HTMLInputElement {
  return document.querySelector<HTMLInputElement>('input[id^="q"][id$="_-mark"]')!
}

export function getMaxMark(): string {
  const element = document.querySelector<HTMLInputElement>('input[name^="q"][name$="_-maxmark"]')!
  return element.value
}

export function getSubmitButton(): HTMLInputElement {
  return document.querySelector<HTMLInputElement>('input#id_submitbutton')!
}

function getQuizIdAndQuestionNumberFromManualGradedBox(box: HTMLElement): { quizId: string; questionNumber: string } {
  const parts = box.id.split(MANUAL_GRADED_BOX_ID_SEPARATOR)
  return {
    quizId: parts[MANUAL_GRADED_BOX_ID_QUIZ_ID_INDEX] ?? '',
    questionNumber: parts[MANUAL_GRADED_BOX_ID_QUESTION_NUMBER_INDEX] ?? ''
  }
}

function getAttemptId(): string {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('attempt') ?? ''
}

export function getAutoGradeId(box: HTMLElement): AutoGradeId {
  const { quizId, questionNumber } = getQuizIdAndQuestionNumberFromManualGradedBox(box)
  const attemptId = getAttemptId()
  return { quizId, questionNumber, attemptId }
}

export function getMainDiv(): HTMLElement {
  return document.querySelector<HTMLElement>('div[role="main"]')!
}

export function getManualGradedBoxes(): NodeListOf<HTMLElement> {
  return document.querySelectorAll<HTMLElement>('div.manualgraded.complete')
}

export function getCommentFromManualGradedBox(box: HTMLElement): HTMLElement {
  return box.querySelector<HTMLElement>('div.comment')!
}

export function getCommentActionLink(comment: HTMLElement): HTMLAnchorElement {
  return comment.querySelector<HTMLAnchorElement>('div.commentlink a')!
}

export function getQuizId(): string {
  const element = document.querySelector<HTMLAnchorElement>('div.submitbtns a.mod_quiz-next-nav')!
  const url = new URL(element.href)
  return url.searchParams.get('id') ?? ''
}
