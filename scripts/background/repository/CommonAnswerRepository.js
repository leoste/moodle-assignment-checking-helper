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
      "text":"One note is that the file format is wrong. Instead of '.txt', it should be '.sql'.",
      "enabled":false
    },
    {
      "text":"Resolve the mentioned issues, resubmit and then I can raise the grade.",
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