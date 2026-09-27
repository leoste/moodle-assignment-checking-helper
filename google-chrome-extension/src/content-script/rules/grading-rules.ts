import type { Feedback } from '../../shared/types/Feedback'

const FALLBACK_GRADE = 100

export function calculateGrade(feedback: Feedback[]): number {
  const totalPoints = feedback.reduce((sum, item) => {
    return sum + item.parts.reduce((ps, p) => {
      return ps + (p.enabled ? (p.points ?? 0) : 0)
    }, 0)
  }, 0)
  return totalPoints > 0 ? totalPoints : FALLBACK_GRADE
}

export function buildComment(prefix: string, feedback: Feedback[]): string {
  const texts: string[] = []
  if (prefix) texts.push(prefix)
  for (const item of feedback) {
    for (const part of item.parts) {
      if (part.enabled && part.enabledText) texts.push(part.enabledText)
      if (!part.enabled && part.disabledText) texts.push(part.disabledText)
    }
  }
  return texts.join('\n')
}
