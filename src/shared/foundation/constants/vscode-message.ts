export const STUDENT_SUBMISSION_CHANNEL = 'student-submission'
// Sent by a VS Code window to the window that receives the students, to take the reception over.
export const RECEPTION_HAND_OVER_CHANNEL = 'reception-hand-over'

export const RESPONSE_STATUS_OK = 'ok'
export const RESPONSE_STATUS_ERROR = 'error'
export const RESPONSE_STATUS_UNHANDLED = 'unhandled'
export const RESPONSE_STATUS_NOT_FOUND = 'not-found'
export const RESPONSE_STATUS_NO_WORKSPACE = 'no-workspace'
export const RESPONSE_STATUS_NOTHING_OPENED = 'nothing-opened'

// Outcomes of a request that got no response, decided by the Chrome extension.
export const REQUEST_STATUS_UNREACHABLE = 'unreachable'
export const REQUEST_STATUS_NO_ANSWER = 'no-answer'
