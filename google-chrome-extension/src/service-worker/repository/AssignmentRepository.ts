import type { Assignment } from '../../shared/types/Assignment'
import type { CommonAnswer } from '../../shared/types/CommonAnswer'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import type { GradePart } from '../../shared/types/GradePart'
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
      } catch {
        // skip files that are not valid JSON or don't match the expected shape
      }
    }
    return definitions
  }

  async findByMoodleId(moodleId: string): Promise<Assignment | undefined> {
    const definitions = await this.getAllDefinitions()
    return definitions.find(d => d.moodleIds.some(id => String(id) === moodleId))
  }

  async getCommonAnswers(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    const definition = await this.findByMoodleId(assignmentId)
    return definition?.commonAnswers
  }

  async getGradeParts(assignmentId: string): Promise<GradePart[] | undefined> {
    const definition = await this.findByMoodleId(assignmentId)
    return definition?.gradeParts
  }
}

export const assignmentRepository = new AssignmentRepository()
