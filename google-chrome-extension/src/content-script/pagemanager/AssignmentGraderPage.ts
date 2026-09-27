import MoodlePage from './MoodlePage'

const ASSIGNMENT_ID_PARAM = 'id'
const GRADE_PANEL_SELECTOR = 'div[data-region="grade-panel"]'
const GRADE_INPUT_SELECTOR = 'input#id_grade'
const COMMENT_LINK_SELECTOR = 'a.comment-link'
const COMMENT_TEXTAREA_SELECTOR = 'div.comment-area div.db textarea'
const STUDENT_NAME_SELECTOR = 'div[data-region="user-info"] h4 a'

export default class AssignmentGraderPage extends MoodlePage {
  getAssignmentId(): string {
    return this.getUrlParam(ASSIGNMENT_ID_PARAM)
  }

  getStudentName(): string {
    return this.getDirectTextContent(document.querySelector<HTMLElement>(STUDENT_NAME_SELECTOR)!)
  }

  insertPanel(panel: HTMLElement): void {
    const gradePanel = document.querySelector<HTMLElement>(GRADE_PANEL_SELECTOR)!
    this.getMainRegion().insertBefore(panel, gradePanel.nextSibling)
  }

  expandCommentSection(): void {
    document.querySelector<HTMLElement>(COMMENT_LINK_SELECTOR)!.click()
  }

  setGrade(grade: string): void {
    document.querySelector<HTMLInputElement>(GRADE_INPUT_SELECTOR)!.value = grade
  }

  setComment(comment: string): void {
    document.querySelector<HTMLTextAreaElement>(COMMENT_TEXTAREA_SELECTOR)!.value = comment
  }
}
