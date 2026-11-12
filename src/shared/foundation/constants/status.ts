export const STATUS_TOPIC_CONNECTION = 'connection'
export const STATUS_TOPIC_STUDENT_SUBMISSION = 'student-submission'
export const STATUS_TOPIC_DEFINITIONS_FOLDER = 'definitions-folder'
export const STATUS_TOPIC_DEFINITION = 'definition'
export const STATUS_TOPIC_BROKEN_DEFINITIONS = 'broken-definitions'
export const STATUS_TOPIC_PANEL = 'panel'
export const STATUS_TOPIC_MOODLE_PAGE = 'moodle-page'
export const STATUS_TOPIC_APPLY = 'apply'

// The order in which the topics are shown.
export const STATUS_TOPICS = [
  STATUS_TOPIC_CONNECTION,
  STATUS_TOPIC_STUDENT_SUBMISSION,
  STATUS_TOPIC_DEFINITIONS_FOLDER,
  STATUS_TOPIC_DEFINITION,
  STATUS_TOPIC_BROKEN_DEFINITIONS,
  STATUS_TOPIC_PANEL,
  STATUS_TOPIC_MOODLE_PAGE,
  STATUS_TOPIC_APPLY,
] as const

export const STATUS_LEVEL_INFO = 'info'
export const STATUS_LEVEL_PROGRESS = 'progress'
export const STATUS_LEVEL_PROBLEM = 'problem'
