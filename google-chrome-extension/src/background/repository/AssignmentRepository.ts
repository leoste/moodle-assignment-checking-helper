import type { AssignmentDefinition, FileSourceInfo } from '../../types'
import { fileCacheRepository } from './FileCacheRepository'
import BaseRepository from './BaseRepository'

export default class AssignmentRepository extends BaseRepository {

// TODO: ensure this is actually really the source of truth everywhere.
// TODO: this should extend filecacherepository instead of using it internally, this is semantically wrong. fuck ai
  readonly fileSourceInfo: FileSourceInfo = {
    displayName: 'Definitsioonide kaust',
    directoryConfigKey: 'config.assignmentDirectory',
    cacheKey: 'file-cache.assignments',
  }

  async getAllDefinitions(): Promise<AssignmentDefinition[]> {
    const fileContents = await fileCacheRepository.get(this.fileSourceInfo.cacheKey)
    const definitions: AssignmentDefinition[] = []
    for (const content of fileContents) {
      try {
        definitions.push(JSON.parse(content) as AssignmentDefinition)
      } catch {
        // skip files that are not valid JSON or don't match the expected shape
      }
    }
    return definitions
  }

  async findByMoodleId(moodleId: string): Promise<AssignmentDefinition | undefined> {
    const definitions = await this.getAllDefinitions()
    return definitions.find(d => d.moodleIds.some(id => String(id) === moodleId))
  }
}

export const assignmentRepository = new AssignmentRepository()
