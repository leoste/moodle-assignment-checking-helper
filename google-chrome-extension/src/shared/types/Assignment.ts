import type { Feedback } from './Feedback'

export interface Assignment {
  name: string
  moodleIds: string[]
  course_code?: string
  feedback: Feedback[]
}
