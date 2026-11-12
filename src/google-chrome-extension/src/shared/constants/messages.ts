export const FILES_GET_SOURCES = 'files/get-sources'
export const FILES_UPDATE_CACHE = 'files/update-cache'

export const ASSIGNMENTS_GET_ALL = 'assignments/get-all'
export const ASSIGNMENTS_UPDATED = 'assignments/updated'
export const FEEDBACK_GET = 'feedback/get'
export const STUDENT_SUBMISSION_OPEN = 'student-submission/open'
export const PANEL_RELOAD = 'panel/reload'
export const QUIZ_AUTO_GRADE_BEGIN = 'quiz/auto-grade/begin'
export const QUIZ_AUTO_GRADE_END = 'quiz/auto-grade/end'
export const QUIZ_AUTO_GRADE_IS_ACTIVE = 'quiz/auto-grade/is-active'

// The long-lived port over which the service worker sends its statuses to the panel and the popup.
export const STATUS_PORT_NAME = 'status'

// The long-lived port that carries Chrome messages between the service worker and the panel or the popup, both ways.
export const MESSAGE_PORT_NAME = 'messages'
