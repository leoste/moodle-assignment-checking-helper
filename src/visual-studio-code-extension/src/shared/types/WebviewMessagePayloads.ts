import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { NewsPayload } from '@shared/types/payload/NewsPayload'
import type {
  NEWS_REPORT,
  NEWS_SUBSCRIBE,
  RECEPTION_TAKE_OVER,
  SETTINGS_CHANGE,
  SETTINGS_GET,
} from '../constants/webview-messages'
import type { SettingsChangePayload } from './payload/SettingsChangePayload'

export type WebviewMessagePayloads = {
  [SETTINGS_GET]: BasePayload
  [SETTINGS_CHANGE]: SettingsChangePayload
  [RECEPTION_TAKE_OVER]: BasePayload
  [NEWS_SUBSCRIBE]: BasePayload
  [NEWS_REPORT]: NewsPayload
}
