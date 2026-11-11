import type { Status } from '@shared/types/Status'
import type { DefinitionLookup } from '../types/DefinitionLookup'
import type { BrokenFile } from '../types/BrokenFile'
import type { SampleMismatch } from '../types/SampleMismatch'
import { MISMATCH_MISSING, MISMATCH_NOT_ALLOWED, MISMATCH_WRONG_TYPE } from '../constants/sample-check'
import {
  STATUS_LEVEL_INFO,
  STATUS_LEVEL_PROBLEM,
  STATUS_LEVEL_PROGRESS,
  STATUS_TOPIC_APPLY,
  STATUS_TOPIC_BROKEN_DEFINITIONS,
  STATUS_TOPIC_DEFINITION,
  STATUS_TOPIC_DEFINITIONS_FOLDER,
  STATUS_TOPIC_MOODLE_PAGE,
  STATUS_TOPIC_PANEL,
} from '@shared/constants/status'
import { translations } from '@shared/translations/translations'

const BROKEN_FILE_SEPARATOR = ', '
const SENTENCE_SEPARATOR = '. '

export function getDefinitionSearchingStatus(): Status {
  return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROGRESS, text: translations.definitions.searching }
}

// Undefined when the service worker couldn't look the definition up.
export function getDefinitionStatus(lookup: DefinitionLookup | undefined, assignmentId: string): Status {
  const texts = translations.definitions
  if (!lookup) return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROBLEM, text: texts.lookupFailed }
  if (!lookup.folderChosen) return getMissingDefinitionStatus(texts.folderNotChosen, assignmentId)
  if (!lookup.loaded) return getMissingDefinitionStatus(texts.notLoaded, assignmentId)
  if (!lookup.definition) return getMissingDefinitionStatus(texts.notFound, assignmentId)
  return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_INFO, text: texts.found(lookup.definition.name) }
}

// The ID is what the lecturer adds to a definition's `moodleIds`.
function getMissingDefinitionStatus(text: string, assignmentId: string): Status {
  return {
    topic: STATUS_TOPIC_DEFINITION,
    level: STATUS_LEVEL_PROBLEM,
    text: [text, translations.definitions.moodleId(assignmentId)].join(SENTENCE_SEPARATOR),
  }
}

export function getDefinitionsFolderStatus(folderChosen: boolean, loaded: boolean, definitionCount: number): Status {
  const texts = translations.definitions
  if (!folderChosen) return { topic: STATUS_TOPIC_DEFINITIONS_FOLDER, level: STATUS_LEVEL_PROBLEM, text: texts.folderNotChosen }
  if (!loaded) return { topic: STATUS_TOPIC_DEFINITIONS_FOLDER, level: STATUS_LEVEL_PROBLEM, text: texts.notLoaded }
  return { topic: STATUS_TOPIC_DEFINITIONS_FOLDER, level: STATUS_LEVEL_INFO, text: texts.loaded(definitionCount) }
}

export function getDefinitionsLoadingStatus(): Status {
  return { topic: STATUS_TOPIC_DEFINITIONS_FOLDER, level: STATUS_LEVEL_PROGRESS, text: translations.fileSource.refreshing }
}

export function getNoFolderPermissionStatus(): Status {
  return { topic: STATUS_TOPIC_DEFINITIONS_FOLDER, level: STATUS_LEVEL_PROBLEM, text: translations.definitions.noPermission }
}

// Null when there are no broken files.
export function getBrokenDefinitionsStatus(brokenFiles: BrokenFile[]): Status | null {
  if (brokenFiles.length === 0) return null
  const fileTexts = brokenFiles.map(file => translations.definitions.brokenFile(file.name, getMismatchText(file.mismatch)))
  return {
    topic: STATUS_TOPIC_BROKEN_DEFINITIONS,
    level: STATUS_LEVEL_PROBLEM,
    text: translations.definitions.brokenFiles(fileTexts.join(BROKEN_FILE_SEPARATOR)),
  }
}

function getMismatchText(mismatch: SampleMismatch | null): string {
  const texts = translations.definitionProblems
  if (!mismatch) return texts.invalidJson
  const path = mismatch.path || texts.wholeFile
  switch (mismatch.reason) {
    case MISMATCH_MISSING:
      return texts.missing(path)
    case MISMATCH_NOT_ALLOWED:
      return texts.notAllowed(path)
    case MISMATCH_WRONG_TYPE:
      return texts.wrongType(path, texts.valueTypes[mismatch.expectedType])
  }
}

export function getPanelNotActivatedStatus(): Status {
  return { topic: STATUS_TOPIC_PANEL, level: STATUS_LEVEL_PROBLEM, text: translations.popup.panelNotActivated }
}

export function getElementNotFoundStatus(selector: string): Status {
  return { topic: STATUS_TOPIC_MOODLE_PAGE, level: STATUS_LEVEL_PROBLEM, text: translations.moodlePage.elementNotFound(selector) }
}

export function getAppliedStatus(): Status {
  return { topic: STATUS_TOPIC_APPLY, level: STATUS_LEVEL_INFO, text: translations.apply.applied }
}
