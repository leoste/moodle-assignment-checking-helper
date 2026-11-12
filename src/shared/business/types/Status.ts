import type { STATUS_LEVEL_INFO, STATUS_LEVEL_PROBLEM, STATUS_LEVEL_PROGRESS, STATUS_TOPICS } from '../../foundation/constants/status'

export type StatusTopic = typeof STATUS_TOPICS[number]

export type StatusLevel =
  | typeof STATUS_LEVEL_INFO
  | typeof STATUS_LEVEL_PROGRESS
  | typeof STATUS_LEVEL_PROBLEM

export interface Status {
  topic: StatusTopic
  level: StatusLevel
  text: string
  // A longer text that VS Code also shows as a popup, when the lecturer has to do something about it.
  popupText?: string
}
