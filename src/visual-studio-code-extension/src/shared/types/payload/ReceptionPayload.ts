import type { BasePayload } from '@shared/types/payload/BasePayload'

export interface ReceptionPayload extends BasePayload {
  // Whether this window receives the students.
  receiving: boolean
}
