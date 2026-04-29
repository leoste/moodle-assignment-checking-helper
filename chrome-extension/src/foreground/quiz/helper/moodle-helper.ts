import type { AutoGradeId } from '../../../types'

export function executeOnPageLoad(callback: () => void): void {
  const observer = new PageUpdateObserver()
  observer.addCallback(callback)
}

class PageUpdateObserver {

  #timeoutDuration = 1200
  #lastURL = location.href

  addCallback(callback: () => void): void {
    this.#executeOnPageRefresh(callback)
    this.#executeOnPageNavigation(callback)
  }

  #executeOnPageRefresh(callback: () => void): void {
    let idleTimer: ReturnType<typeof setTimeout>

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

  #executeOnPageNavigation(callback: () => void): void {
    setInterval(() => {
      if (location.href !== this.#lastURL) {
        this.#lastURL = location.href
        this.#executeOnPageRefresh(callback)
      }
    }, 100)
  }
}

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
  const id = box.id
  const parts = id.split('-')
  return {
    quizId: parts[1] ?? '',
    questionNumber: parts[2] ?? ''
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
