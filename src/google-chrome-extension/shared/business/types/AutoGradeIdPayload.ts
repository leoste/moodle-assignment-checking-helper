import type { BasePayload } from '@shared/business/types/BasePayload'
import type { AutoGradeId } from './AutoGradeId'

export interface AutoGradeIdPayload extends BasePayload {
  autoGradeId: AutoGradeId
}
