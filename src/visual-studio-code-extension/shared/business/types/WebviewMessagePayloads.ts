import type { BasePayload } from '@shared/business/types/BasePayload'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import type {
  NEWS_REPORT,
  NEWS_SUBSCRIBE,
  RECEPTION_TAKE_OVER,
  SETTINGS_CHANGE,
  SETTINGS_GET,
} from '../../foundation/constants/webview-messages'
import type { SettingsChangePayload } from './SettingsChangePayload'

export type WebviewMessagePayloads = {
  [SETTINGS_GET]: BasePayload
  [SETTINGS_CHANGE]: SettingsChangePayload
  [RECEPTION_TAKE_OVER]: BasePayload
  [NEWS_SUBSCRIBE]: BasePayload
  [NEWS_REPORT]: NewsPayload
}
