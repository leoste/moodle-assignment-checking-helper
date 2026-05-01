// Identifies a specific manually-graded question in a quiz attempt.
export interface AutoGradeId {
  quizId: string
  questionNumber: string
  attemptId: string
}

// A single common comment snippet with its toggle state.
export interface CommonAnswer {
  text: string
  enabled: boolean
}

// A single scoreable sub-item within a grade section.
export interface GradePartItem {
  points: number
  text: string
  enabled: boolean
}

// A top-level grading category containing sub-items.
export interface GradePart {
  title: string
  max: { points: number; text: string }
  parts: GradePartItem[]
  // Assigned at runtime; not stored in repository data.
  _id?: number
}

// Shape of a message sent from a content script to the service worker.
export interface ExtensionMessage<T = Record<string, unknown>> {
  type: string
  content: T
}

// Describes a file source: which folder to read from and where to cache results.
export interface FileSourceInfo {
  displayName: string
  directoryConfigKey: string
  cacheKey: string
}

// A user-defined assignment that may correspond to multiple Moodle assignment IDs across course iterations.
export interface AssignmentDefinition {
  name: string
  moodleIds: string[]
  commonAnswers: CommonAnswer[]
  gradeParts: GradePart[]
}

export type { WebSocketMessage, WebSocketResponse } from '@shared/types/WebSocketProtocol'
