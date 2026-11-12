import type { Feedback } from '../../../shared/business/types/Feedback'
import type { FeedbackPart } from '../../../shared/business/types/FeedbackPart'

// When the definition is reloaded, a part keeps its selection if the new definition has a part with the same group title and texts.
// New parts, and parts whose texts were edited, get their default selection.
export function carryOverSelection(oldFeedback: Feedback[], oldSelection: boolean[][], newFeedback: Feedback[]): boolean[][] {
  const selections = new Map<string, boolean>()
  for (const [groupIndex, group] of oldFeedback.entries()) {
    for (const [partIndex, part] of group.parts.entries()) {
      selections.set(getPartKey(group, part), oldSelection[groupIndex][partIndex])
    }
  }
  return newFeedback.map(group => group.parts.map(part => selections.get(getPartKey(group, part)) ?? part.enabled))
}

function getPartKey(group: Feedback, part: FeedbackPart): string {
  return JSON.stringify([group.title, part.labelText ?? null, part.enabledText ?? null, part.disabledText ?? null])
}
