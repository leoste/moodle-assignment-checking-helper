import type { BasePayload } from '@shared/business/types/BasePayload'
import type { Settings } from './Settings'

export interface SettingsChangePayload extends BasePayload {
  settings: Partial<Settings>
}
