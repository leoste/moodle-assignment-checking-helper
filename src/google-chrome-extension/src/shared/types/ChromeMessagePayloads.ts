import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { NewsPayload } from '@shared/types/payload/NewsPayload'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'
import type {
  ASSIGNMENTS_GET_ALL,
  ASSIGNMENTS_UPDATED,
  FEEDBACK_GET,
  FILES_GET_SOURCES,
  FILES_UPDATE_CACHE,
  NEWS_REPORT,
  NEWS_SUBSCRIBE,
  PANEL_RELOAD,
  QUIZ_AUTO_GRADE_BEGIN,
  QUIZ_AUTO_GRADE_END,
  QUIZ_AUTO_GRADE_IS_ACTIVE,
  STUDENT_SUBMISSION_OPEN,
} from '../constants/messages'
import type { AssignmentIdPayload } from './payload/AssignmentIdPayload'
import type { AutoGradeIdPayload } from './payload/AutoGradeIdPayload'
import type { FileCacheUpdatePayload } from './payload/FileCacheUpdatePayload'

export type ChromeMessagePayloads = {
  [FILES_GET_SOURCES]: BasePayload
  [FILES_UPDATE_CACHE]: FileCacheUpdatePayload
  [ASSIGNMENTS_GET_ALL]: BasePayload
  [ASSIGNMENTS_UPDATED]: BasePayload
  [FEEDBACK_GET]: AssignmentIdPayload
  [STUDENT_SUBMISSION_OPEN]: StudentNamePayload
  [PANEL_RELOAD]: BasePayload
  [QUIZ_AUTO_GRADE_BEGIN]: AutoGradeIdPayload
  [QUIZ_AUTO_GRADE_END]: AutoGradeIdPayload
  [QUIZ_AUTO_GRADE_IS_ACTIVE]: AutoGradeIdPayload
  [NEWS_SUBSCRIBE]: BasePayload
  [NEWS_REPORT]: NewsPayload
}
