import type { Status } from '@shared/types/Status'
import type { DefinitionLookup } from '../types/DefinitionLookup'
import {
  STATUS_LEVEL_INFO,
  STATUS_LEVEL_PROBLEM,
  STATUS_LEVEL_PROGRESS,
  STATUS_TOPIC_BROKEN_DEFINITIONS,
  STATUS_TOPIC_DEFINITION,
  STATUS_TOPIC_DEFINITIONS_FOLDER,
  STATUS_TOPIC_MOODLE_PAGE,
} from '@shared/constants/status'
import { translations } from '@shared/translations/translations'

const BROKEN_FILE_NAME_SEPARATOR = ', '

export function getDefinitionSearchingStatus(): Status {
  return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROGRESS, text: translations.definitions.searching }
}

// Undefined when the service worker couldn't look the definition up.
export function getDefinitionStatus(lookup: DefinitionLookup | undefined, assignmentId: string): Status {
  const texts = translations.definitions
  if (!lookup) return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROBLEM, text: texts.lookupFailed }
  if (!lookup.folderChosen) return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROBLEM, text: texts.folderNotChosen }
  if (!lookup.loaded) return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROBLEM, text: texts.notLoaded }
  if (!lookup.definition) return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_PROBLEM, text: texts.notFound(assignmentId) }
  return { topic: STATUS_TOPIC_DEFINITION, level: STATUS_LEVEL_INFO, text: texts.found(lookup.definition.name) }
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
export function getBrokenDefinitionsStatus(brokenFiles: string[]): Status | null {
  if (brokenFiles.length === 0) return null
  return {
    topic: STATUS_TOPIC_BROKEN_DEFINITIONS,
    level: STATUS_LEVEL_PROBLEM,
    text: translations.definitions.brokenFiles(brokenFiles.join(BROKEN_FILE_NAME_SEPARATOR)),
  }
}

export function getElementNotFoundStatus(selector: string): Status {
  return { topic: STATUS_TOPIC_MOODLE_PAGE, level: STATUS_LEVEL_PROBLEM, text: translations.moodlePage.elementNotFound(selector) }
}
