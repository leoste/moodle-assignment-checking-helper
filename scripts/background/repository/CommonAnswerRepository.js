export default class CommonAnswerRepository {
  static #data = [
    {
      "text":"Hello!",
      "enabled":true
    },
    {
      "text":"Everything is correct.",
      "enabled":true
    },
    {
      "text":"The queries are well written and run successfully.",
      "enabled":true
    },
    {
      "text":"The CREATE and INSERT commands are all good, but take another look at the SELECT statements.",
      "enabled":false
    },
    {
      "text":"Best regards, Karl Aleksander Leoste",
      "enabled":true
    },
  ]

  async getAll(assignmentId) {
    return CommonAnswerRepository.#data
  }
}