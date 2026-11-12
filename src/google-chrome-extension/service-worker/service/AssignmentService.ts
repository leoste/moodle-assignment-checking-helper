import type { Definitions } from '../../shared/business/types/Definitions'
import type { DefinitionLookup } from '../../shared/business/types/DefinitionLookup'
import { assignmentRepository } from '../repository/AssignmentRepository'
import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'
import BaseService from '@shared/service/BaseService'

class AssignmentService extends BaseService {
  async getAllAssignments(): Promise<Definitions> {
    return assignmentRepository.getAllDefinitions()
  }

  async lookUpDefinition(assignmentId: string): Promise<DefinitionLookup> {
    const { assignments, brokenFiles } = await assignmentRepository.getAllDefinitions()
    const moodleId = Number(assignmentId)
    return {
      folderChosen: await directoryHandleRepository.getDirectoryHandle(assignmentRepository.fileSourceInfo) !== undefined,
      loaded: await assignmentRepository.getUpdatedAt() !== null,
      definition: assignments.find(d => d.moodleIds.includes(moodleId)) ?? null,
      brokenFiles,
    }
  }
}

export const assignmentService = new AssignmentService()
