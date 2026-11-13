import type { Assignment } from '../../shared/business/types/Assignment'
import type { BrokenFile } from '../../shared/business/types/BrokenFile'
import type { Definitions } from '../../shared/business/types/Definitions'
import type { FileSourceInfo } from '../../shared/business/types/FileSourceInfo'
import FileCacheRepository from './FileCacheRepository'
import checkAgainstSample from '../../shared/foundation/util/checkAgainstSample'
import sampleDefinition from '../../../definitions/sample-definition.json'
import { translations } from '@shared/business/translations/translations'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { ASSIGNMENT_DIRECTORY_HANDLE_KEY, ASSIGNMENT_FILE_CACHE_KEY } from '../../shared/foundation/constants/storage'

class AssignmentRepository extends FileCacheRepository {
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: translations.definitions.folderName,
    directoryHandleKey: ASSIGNMENT_DIRECTORY_HANDLE_KEY,
    cacheKey: ASSIGNMENT_FILE_CACHE_KEY,
  }

  async getAllDefinitions(): Promise<Definitions> {
    const assignments: Assignment[] = []
    const brokenFiles: BrokenFile[] = []
    for (const file of await this.getFiles()) {
      let definition: unknown
      try {
        definition = JSON.parse(file.content)
      } catch (err) {
        logAnnouncer.announceLogError(this, `skipping definition file that is not valid JSON: ${file.name}`, err)
        brokenFiles.push({ name: file.name, mismatch: null })
        continue
      }

      const mismatches = checkAgainstSample(definition, sampleDefinition)
      if (mismatches.length > 0) {
        logAnnouncer.announceLogError(this, `skipping definition file that doesn't match the sample definition: ${file.name}`, mismatches)
        brokenFiles.push({ name: file.name, mismatch: mismatches[0] })
        continue
      }
      assignments.push(definition as Assignment)
    }
    return { assignments, brokenFiles }
  }
}

export const assignmentRepository = new AssignmentRepository()
