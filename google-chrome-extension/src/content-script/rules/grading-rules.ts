import type { Feedback } from '../../shared/types/Feedback'
import { getPartCommentText, getPartPoints } from './feedback-rules'

const FALLBACK_GRADE = 100

export function calculateGrade(feedback: Feedback[], selection: boolean[][]): number {
  const totalPoints = feedback.reduce((sum, group, groupIndex) => {
    return sum + group.parts.reduce((ps, part, partIndex) => {
      return ps + getPartPoints(part, selection[groupIndex][partIndex])
    }, 0)
  }, 0)
  return totalPoints > 0 ? totalPoints : FALLBACK_GRADE
}

export function buildComment(prefix: string, feedback: Feedback[], selection: boolean[][]): string {
  const texts: string[] = []
  if (prefix) texts.push(prefix)
  for (const [groupIndex, group] of feedback.entries()) {
    for (const [partIndex, part] of group.parts.entries()) {
      const text = getPartCommentText(part, selection[groupIndex][partIndex])
      if (text) texts.push(text)
    }
  }
  return texts.join('\n')
}
