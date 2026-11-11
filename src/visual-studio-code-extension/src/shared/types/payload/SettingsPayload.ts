import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { Settings } from '../Settings'

export interface SettingsPayload extends BasePayload {
  settings: Settings
}
