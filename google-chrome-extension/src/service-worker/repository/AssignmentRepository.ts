import type { Assignment } from '../../shared/types/Assignment'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import FileCacheRepository from './FileCacheRepository'
import { translations } from '@shared/translations/translations'
import { logger } from '@shared/logging/logger'

const ASSIGNMENT_DIRECTORY_CONFIG_KEY = 'config.assignmentDirectory'
const ASSIGNMENT_FILE_CACHE_KEY = 'file-cache.assignments'

class AssignmentRepository extends FileCacheRepository {
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: translations.definitions.folderName,
    directoryConfigKey: ASSIGNMENT_DIRECTORY_CONFIG_KEY,
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
