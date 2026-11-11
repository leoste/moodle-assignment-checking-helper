import type { Definitions } from '../../shared/types/Definitions'
import type { DefinitionLookup } from '../../shared/types/DefinitionLookup'
import { assignmentRepository } from '../repository/AssignmentRepository'
import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'
import BaseService from '@shared/service/BaseService'

class AssignmentService extends BaseService {
  async getAllAssignments(): Promise<Definitions> {
    return assignmentRepository.getAllDefinitions()
  }

  async lookUpDefinition(assignmentId: string): Promise<DefinitionLookup> {
    const { assignments, brokenFiles } = await assignmentRepository.getAllDefinitions()
    return {
      folderChosen: await directoryHandleRepository.getDirectoryHandle(assignmentRepository.fileSourceInfo) !== undefined,
      loaded: await assignmentRepository.getUpdatedAt() !== null,
      definition: assignments.find(d => d.moodleIds.some(id => String(id) === assignmentId)) ?? null,
      brokenFiles,
    }
  }
}

export const assignmentService = new AssignmentService()
