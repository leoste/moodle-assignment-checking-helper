import type { FeedbackPart } from './FeedbackPart'

export interface Feedback {
  title: string
  max_points: number
  parts: FeedbackPart[]
}
