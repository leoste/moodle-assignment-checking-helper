export default class GradePartRepository {
  // TODO: store and fetch from localStorage, add UI page for chrome user to edit this data by themselves, add data file import export options
  static #data = {
    '757712': [
      {
        "text":"Best regards, Karl Aleksander Leoste",
        "enabled":true
      },
    ]
  }

  async getAll(assignmentId) {
    return GradePartRepository.#data[assignmentId]
  }
}