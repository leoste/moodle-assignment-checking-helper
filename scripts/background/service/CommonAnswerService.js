import repositoryRegistry from "../repository/repository-registry.js";

export default class CommonAnswerService {
  
  async getAll(assignmentId) {
    const data = await repositoryRegistry.commonAnswerRepository.getAll(assignmentId)
    return data
  }
}