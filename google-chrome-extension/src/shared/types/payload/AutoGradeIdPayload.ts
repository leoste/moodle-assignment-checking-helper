import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { AutoGradeId } from '../AutoGradeId'

export interface AutoGradeIdPayload extends BasePayload {
  autoGradeId: AutoGradeId
}
