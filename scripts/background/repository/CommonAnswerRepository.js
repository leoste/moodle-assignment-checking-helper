export default class CommonAnswerRepository {
  async getAll(assignmentId) {
    const mockData = [
      {
        "text":"Well done (assignment id: " + assignmentId + ")",
        "enabled":false
      }
    ]

    return mockData
  }
}