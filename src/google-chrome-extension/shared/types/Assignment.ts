import type { Feedback } from './Feedback'

// Has to match src/definitions/sample-definition.json, which definition files are checked against.
export interface Assignment {
  name: string
  moodleIds: number[]
  course_code?: string
  feedback: Feedback[]
}
