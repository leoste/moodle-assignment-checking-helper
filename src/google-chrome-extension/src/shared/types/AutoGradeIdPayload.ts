import type { BasePayload } from '@shared/types/BasePayload'
import type { AutoGradeId } from './AutoGradeId'

export interface AutoGradeIdPayload extends BasePayload {
  autoGradeId: AutoGradeId
}
