import { getDirectTextContent } from './element-creation-helper'

export function getMainDiv(): HTMLElement {
  return document.querySelector<HTMLElement>('div[role="main"]')!
}

export function getGradePanel(): HTMLElement {
  return document.querySelector<HTMLElement>('div[data-region="grade-panel"]')!
}

export function getCommentLink(): HTMLElement {
  return document.querySelector<HTMLElement>('a.comment-link')!
}

export function getCommentTextarea(): HTMLTextAreaElement {
  return document.querySelector<HTMLTextAreaElement>('div.comment-area div.db textarea')!
}

export function getGradeInput(): HTMLInputElement {
  return document.querySelector<HTMLInputElement>('input#id_grade')!
}

export function getBottomDiv(): HTMLElement {
  return document.querySelector<HTMLElement>('div[data-region="grade-actions"] > div:has(> form)')!
}

export function getSaveCommentButton(): HTMLElement {
  return document.querySelector<HTMLElement>('a[id^="comment-action-post-"]')!
}

export function getSaveGradeAndShowNextButton(): HTMLButtonElement {
  return document.querySelector<HTMLButtonElement>('button[name="saveandshownext"]')!
}

export function getAssignmentId(): string {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') ?? ''
}

export function getStudentName(): string {
  const studentNameElement = document.querySelector<HTMLElement>('div[data-region="user-info"] h4 a')!
  return getDirectTextContent(studentNameElement)
}
