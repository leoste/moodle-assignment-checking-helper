import type { Assignment } from './Assignment'

export interface Definitions {
  assignments: Assignment[]
  // Names of the files in the definitions folder that couldn't be read as a definition.
  brokenFiles: string[]
}
