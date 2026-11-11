import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { Settings } from '../Settings'

export interface SettingsChangePayload extends BasePayload {
  settings: Partial<Settings>
}
