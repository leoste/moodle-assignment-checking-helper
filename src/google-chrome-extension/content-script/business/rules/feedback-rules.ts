import type { Feedback } from '../../../shared/business/types/Feedback'
import type { FeedbackPart } from '../../../shared/business/types/FeedbackPart'
import type { FeedbackView } from '../../../shared/business/types/FeedbackView'

export function getPartPoints(part: FeedbackPart, selected: boolean): number {
  return selected ? (part.points ?? 0) : 0
}

export function getPartCommentText(part: FeedbackPart, selected: boolean): string | null {
  return (selected ? part.enabledText : part.disabledText) || null
}

export function getDefaultSelection(feedback: Feedback[]): boolean[][] {
  return feedback.map(group => group.parts.map(part => part.enabled))
}

export function getFeedbackView(feedback: Feedback[], selection: boolean[][]): FeedbackView[] {
  return feedback.map((group, groupIndex) => ({
    ...group,
    parts: group.parts.map((part, partIndex) => ({
      labelText: part.labelText || null,
      selectedText: getPartCommentText(part, true),
      unselectedText: getPartCommentText(part, false),
      points: getPartPoints(part, true),
      selected: selection[groupIndex][partIndex],
    })),
  }))
}
