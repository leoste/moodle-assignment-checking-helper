import type { AssignmentDefinition, FileSourceInfo } from '../../types'
import FileCacheRepository from './FileCacheRepository'

export default class AssignmentRepository extends FileCacheRepository {
  static #registered = false

  readonly fileSourceInfo: FileSourceInfo = {
    displayName: 'Definitsioonide kaust',
    directoryConfigKey: 'config.assignmentDirectory',
    cacheKey: 'file-cache.assignments',
  }

  override async init(): Promise<void> {
    await super.init()
    if (!AssignmentRepository.#registered) {
      AssignmentRepository.#registered = true
      FileCacheRepository.register(this)
    }
  }

  async getAllDefinitions(): Promise<AssignmentDefinition[]> {
    const fileContents = await this.getFileContents()
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
