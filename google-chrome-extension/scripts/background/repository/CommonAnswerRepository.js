export default class CommonAnswerRepository {
  static #data = {
    '757676': [
      {
        "text":"Everything is correct, the queries are well written and run successfully.",
        "enabled":true
      },
      {
        "text": "Nice use of variables!",
        "enabled":false
      },
      {
        "text": "Interesting approach in the INSERT INTO statements, where you select the id from the other tables. Usually these id-s are hardcoded, but this type of approach can be useful in some cases. Select statements like you have are computationally more expensive than hardcoding id-s and so this approach might not work well in large databases.",
        "enabled":false
      },
      {
        "text":"One note is that the file format is wrong. Instead of '.txt', it should be '.sql'.",
        "enabled":false
      },
      {
        "text":"Just as a note, one insert command could also be used to insert multiple values, using this format: INSERT INTO <table> (...) VALUES (...), (...), (...);",
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
    ],
    '757712': [
      {
        "text":"Best regards, Karl Aleksander Leoste",
        "enabled":true
      },
    ]
  }

  async getAll(assignmentId) {
    return CommonAnswerRepository.#data[assignmentId]
  }
}