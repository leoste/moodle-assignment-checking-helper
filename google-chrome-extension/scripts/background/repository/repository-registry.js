import CommonAnswerRepository from "./CommonAnswerRepository.js";
import GradePartRepository from "./GradePartRepository.js";
import JuhhuuRepository from "./JuhhuuRepository.js";

const repositoryRegistry = {
  juhhuuRepository: new JuhhuuRepository(),
  commonAnswerRepository: new CommonAnswerRepository(),
  gradePartRepository: new GradePartRepository()
}

export default repositoryRegistry