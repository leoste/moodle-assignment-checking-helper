import type { FeedbackPart } from './FeedbackPart'

export interface Feedback {
  title: string
  max: { points: number; text: string | null }
  parts: FeedbackPart[]
  // Assigned at runtime; not stored in repository data.
  _id?: number
}
