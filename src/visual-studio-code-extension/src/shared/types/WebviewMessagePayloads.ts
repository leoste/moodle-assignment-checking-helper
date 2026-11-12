import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { NewsPayload } from '@shared/types/payload/NewsPayload'
import type {
  NEWS_REPORT,
  NEWS_SUBSCRIBE,
  RECEPTION_SHOW,
  RECEPTION_TAKE_OVER,
  SETTINGS_CHANGE,
  SETTINGS_SHOW,
  WEBVIEW_READY,
} from '../constants/webview-messages'
import type { SettingsPayload } from './payload/SettingsPayload'
import type { SettingsChangePayload } from './payload/SettingsChangePayload'
import type { ReceptionPayload } from './payload/ReceptionPayload'

export type WebviewMessagePayloads = {
  [WEBVIEW_READY]: BasePayload
  [SETTINGS_SHOW]: SettingsPayload
  [SETTINGS_CHANGE]: SettingsChangePayload
  [RECEPTION_SHOW]: ReceptionPayload
  [RECEPTION_TAKE_OVER]: BasePayload
  [NEWS_SUBSCRIBE]: BasePayload
  [NEWS_REPORT]: NewsPayload
}
