import type { Assignment } from '../../shared/types/Assignment'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import FileCacheRepository from './FileCacheRepository'

const ASSIGNMENT_DIRECTORY_CONFIG_KEY = 'config.assignmentDirectory'
const ASSIGNMENT_FILE_CACHE_KEY = 'file-cache.assignments'

class AssignmentRepository extends FileCacheRepository {
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: 'Definitsioonide kaust',
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
        // skip files that are not valid JSON, but make the reason visible
        console.error('[AssignmentRepository] Skipping definition file that is not valid JSON:', err, content.slice(0, 200))
      }
    }
    return definitions
  }
}

export const assignmentRepository = new AssignmentRepository()
