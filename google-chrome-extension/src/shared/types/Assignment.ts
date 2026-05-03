import type { Feedback } from './Feedback'

export interface Assignment {
  name: string
  moodleIds: string[]
  feedback: Feedback[]
}
