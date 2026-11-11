import type { Assignment } from './Assignment'

export interface DefinitionLookup {
  folderChosen: boolean
  loaded: boolean
  definition: Assignment | null
  brokenFiles: string[]
}
