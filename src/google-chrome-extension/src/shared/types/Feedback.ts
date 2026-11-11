import type { FeedbackPart } from './FeedbackPart'

export interface Feedback {
  title: string
  intended_max_points: number
  parts: FeedbackPart[]
}
