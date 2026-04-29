import repositoryRegistry from '../repository/repository-registry'
import type { GradePart } from '../../types'

export default class GradePartService {
  async getAll(assignmentId: string): Promise<GradePart[] | undefined> {
    return repositoryRegistry.gradePartRepository.getAll(assignmentId)
  }
}
