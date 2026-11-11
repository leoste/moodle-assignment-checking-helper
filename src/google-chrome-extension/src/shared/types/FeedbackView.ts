import type { Feedback } from './Feedback'
import type { FeedbackPartView } from './FeedbackPartView'

export interface FeedbackView extends Omit<Feedback, 'parts'> {
  parts: FeedbackPartView[]
}
