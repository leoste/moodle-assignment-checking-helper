import type { Assignment } from '../../shared/types/Assignment'
import type { Definitions } from '../../shared/types/Definitions'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import FileCacheRepository from './FileCacheRepository'
import { translations } from '@shared/translations/translations'
import { logger } from '@shared/reporting/logger'
import { ASSIGNMENT_DIRECTORY_HANDLE_KEY, ASSIGNMENT_FILE_CACHE_KEY } from '../../shared/constants/storage'

class AssignmentRepository extends FileCacheRepository {
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: translations.definitions.folderName,
    directoryHandleKey: ASSIGNMENT_DIRECTORY_HANDLE_KEY,
    cacheKey: ASSIGNMENT_FILE_CACHE_KEY,
  }

  async getAllDefinitions(): Promise<Definitions> {
    const assignments: Assignment[] = []
    const brokenFiles: string[] = []
    for (const file of await this.getFiles()) {
      try {
        assignments.push(JSON.parse(file.content) as Assignment)
      } catch (err) {
        logger.error(this, `skipping definition file that is not valid JSON: ${file.name}`, err)
        brokenFiles.push(file.name)
      }
    }
    return { assignments, brokenFiles }
  }
}

export const assignmentRepository = new AssignmentRepository()
