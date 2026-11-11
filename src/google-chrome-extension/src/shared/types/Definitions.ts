import type { Assignment } from './Assignment'
import type { BrokenFile } from './BrokenFile'

export interface Definitions {
  assignments: Assignment[]
  // The files in the definitions folder that couldn't be read as a definition.
  brokenFiles: BrokenFile[]
}
