import type { CommonAnswer } from './CommonAnswer'
import type { GradePart } from './GradePart'

export interface Assignment {
  name: string
  moodleIds: string[]
  commonAnswers: CommonAnswer[]
  gradeParts: GradePart[]
}
