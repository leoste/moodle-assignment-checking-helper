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
      "text": "Interesting approach in the INSERT INTO statements, where you select the id from the other table. Usually these id-s are hardcoded, but this type of approach can be useful in some cases. Select statements like you have are computationally more expensive than hardcoding id-s and so this approach might not work well in large databases.",
      "enabled":false
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