import type { Assignment } from '../../shared/types/Assignment'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import FileCacheRepository from './FileCacheRepository'
import { translations } from '@shared/translations/translations'
import { logger } from '@shared/logging/logger'
import { ASSIGNMENT_DIRECTORY_HANDLE_KEY, ASSIGNMENT_FILE_CACHE_KEY } from '../../shared/constants/storage'

class AssignmentRepository extends FileCacheRepository {
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: translations.definitions.folderName,
    directoryHandleKey: ASSIGNMENT_DIRECTORY_HANDLE_KEY,
    cacheKey: ASSIGNMENT_FILE_CACHE_KEY,
  }

  async getAllDefinitions(): Promise<Assignment[]> {
    const fileContents = await this.getFileContents()
    const definitions: Assignment[] = []
    for (const content of fileContents) {
      try {
        definitions.push(JSON.parse(content) as Assignment)
      } catch (err) {
        logger.error(this, `skipping definition file that is not valid JSON: ${content.slice(0, 200)}`, err)
      }
    }
    return definitions
  }
}

export const assignmentRepository = new AssignmentRepository()
