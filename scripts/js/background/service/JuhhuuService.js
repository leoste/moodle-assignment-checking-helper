import repositoryRegistry from "../repository/repository-registry.js";

export default class JuhhuuService {
  async setTest(value) {
    await repositoryRegistry.juhhuuRepository.setTest(value)
  }

  async getTest() {    
    const value = await repositoryRegistry.juhhuuRepository.getTest()
    return value
  }
}