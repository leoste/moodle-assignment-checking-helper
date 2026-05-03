import type { GradePartItem } from './GradePartItem'

export interface GradePart {
  title: string
  max: { points: number; text: string }
  parts: GradePartItem[]
  // Assigned at runtime; not stored in repository data.
  _id?: number
}
