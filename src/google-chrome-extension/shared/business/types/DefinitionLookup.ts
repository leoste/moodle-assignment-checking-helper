import type { Assignment } from './Assignment'
import type { BrokenFile } from './BrokenFile'

export interface DefinitionLookup {
  folderChosen: boolean
  loaded: boolean
  definition: Assignment | null
  brokenFiles: BrokenFile[]
}
