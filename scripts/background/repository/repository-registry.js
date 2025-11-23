import CommonAnswerRepository from "./CommonAnswerRepository.js";
import JuhhuuRepository from "./JuhhuuRepository.js";

const repositoryRegistry = {
  juhhuuRepository: new JuhhuuRepository(),
  commonAnswerRepository: new CommonAnswerRepository()
}

export default repositoryRegistry