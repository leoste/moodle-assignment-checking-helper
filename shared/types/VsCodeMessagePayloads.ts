import type { STUDENT_SUBMISSION_CHANNEL } from '../constants/vscode-message'
import type { StudentNamePayload } from './payload/StudentNamePayload'

export type VsCodeMessagePayloads = {
  [STUDENT_SUBMISSION_CHANNEL]: StudentNamePayload
}
