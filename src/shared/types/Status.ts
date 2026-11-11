import type { STATUS_LEVEL_INFO, STATUS_LEVEL_PROBLEM, STATUS_LEVEL_PROGRESS, STATUS_TOPICS } from '../constants/status'

export type StatusTopic = typeof STATUS_TOPICS[number]

export type StatusLevel =
  | typeof STATUS_LEVEL_INFO
  | typeof STATUS_LEVEL_PROGRESS
  | typeof STATUS_LEVEL_PROBLEM

export interface Status {
  topic: StatusTopic
  level: StatusLevel
  text: string
}
