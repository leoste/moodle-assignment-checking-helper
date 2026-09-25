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

export function getAssignmentId(): string {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') ?? ''
}

export function getStudentName(): string {
  const studentNameElement = document.querySelector<HTMLElement>('div[data-region="user-info"] h4 a')!
  return getDirectTextContent(studentNameElement)
}
