import repositoryRegistry from "../repository/repository-registry.js";

export default class GradePartService {
  
  async getAll(assignmentId) {
    const data = await repositoryRegistry.gradePartRepository.getAll(assignmentId)
    return data
  }
}