import type { FeedbackPart } from './FeedbackPart'

export interface Feedback {
  title: string
  max_points: number
  parts: FeedbackPart[]
  // Assigned at runtime; not stored in repository data.
  _id?: number
}
