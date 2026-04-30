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

// Shape of a message sent over WebSocket to the VS Code extension.
export interface WebSocketMessage {
  id: string
  channel: string
  content: unknown
}

// Shape of a response received over WebSocket from the VS Code extension.
export interface WebSocketResponse {
  id: string
  content: unknown
}