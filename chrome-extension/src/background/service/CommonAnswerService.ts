import repositoryRegistry from '../repository/repository-registry'
import type { CommonAnswer } from '../../types'

export default class CommonAnswerService {
  async getAll(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    return repositoryRegistry.commonAnswerRepository.getAll(assignmentId)
  }
}
