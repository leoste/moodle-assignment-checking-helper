import type { Assignment } from '../../shared/types/Assignment'
import type { Feedback } from '../../shared/types/Feedback'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
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

  async findByMoodleId(moodleId: string): Promise<Assignment | undefined> {
    const definitions = await this.getAllDefinitions()
    return definitions.find(d => d.moodleIds.some(id => String(id) === moodleId))
  }

  async getFeedback(assignmentId: string): Promise<Feedback[] | undefined> {
    const definition = await this.findByMoodleId(assignmentId)
    return definition?.feedback
  }
}

export const assignmentRepository = new AssignmentRepository()
