import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { Status } from '@shared/types/Status'

export interface StatusesPayload extends BasePayload {
  statuses: Status[]
}
