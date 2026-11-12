import type { RECEPTION_HAND_OVER_CHANNEL, STUDENT_SUBMISSION_CHANNEL } from '../../foundation/constants/vscode-message'
import type { BasePayload } from './BasePayload'
import type { StudentNamePayload } from './StudentNamePayload'

export type VsCodeMessagePayloads = {
  [STUDENT_SUBMISSION_CHANNEL]: StudentNamePayload
  [RECEPTION_HAND_OVER_CHANNEL]: BasePayload
}
