import type { BasePayload } from '@shared/types/payload/BasePayload'
import type {
  RECEPTION_SHOW,
  RECEPTION_TAKE_OVER,
  SETTINGS_CHANGE,
  SETTINGS_SHOW,
  STATUSES_SHOW,
  WEBVIEW_READY,
} from '../constants/webview-messages'
import type { SettingsPayload } from './payload/SettingsPayload'
import type { SettingsChangePayload } from './payload/SettingsChangePayload'
import type { StatusesPayload } from './payload/StatusesPayload'
import type { ReceptionPayload } from './payload/ReceptionPayload'

export type WebviewMessagePayloads = {
  [WEBVIEW_READY]: BasePayload
  [SETTINGS_SHOW]: SettingsPayload
  [SETTINGS_CHANGE]: SettingsChangePayload
  [STATUSES_SHOW]: StatusesPayload
  [RECEPTION_SHOW]: ReceptionPayload
  [RECEPTION_TAKE_OVER]: BasePayload
}
