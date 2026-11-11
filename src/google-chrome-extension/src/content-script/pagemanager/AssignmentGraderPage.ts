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
    return this.getDirectTextContent(this.query<HTMLElement>(STUDENT_NAME_SELECTOR))
  }

  insertPanel(panel: HTMLElement): void {
    const gradePanel = this.query<HTMLElement>(GRADE_PANEL_SELECTOR)
    this.getMainRegion().insertBefore(panel, gradePanel.nextSibling)
  }

  resizeGradePanel(right: number): void {
    const gradePanel = this.query<HTMLElement>(GRADE_PANEL_SELECTOR)
    gradePanel.style.setProperty('width', `${Math.max(right - gradePanel.offsetLeft, 0)}px`, 'important')
  }

  expandCommentSection(): void {
    this.query<HTMLElement>(COMMENT_LINK_SELECTOR).click()
  }

  setGrade(grade: string): void {
    const gradeInput = this.query<HTMLInputElement>(GRADE_INPUT_SELECTOR)
    gradeInput.value = grade
    this.notifyValueChanged(gradeInput)
  }

  setComment(comment: string): void {
    const commentTextarea = this.query<HTMLTextAreaElement>(COMMENT_TEXTAREA_SELECTOR)
    commentTextarea.value = comment
    this.notifyValueChanged(commentTextarea)
  }
}
