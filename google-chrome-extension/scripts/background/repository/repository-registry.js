import CommonAnswerRepository from "./CommonAnswerRepository.js";
import GradePartRepository from "./GradePartRepository.js";
import JuhhuuRepository from "./JuhhuuRepository.js";
import QuizRepository from "./QuizRepository.js";

const repositoryRegistry = {
  juhhuuRepository: new JuhhuuRepository(),
  commonAnswerRepository: new CommonAnswerRepository(),
  gradePartRepository: new GradePartRepository(),
  quizRepository: new QuizRepository()
}

export default repositoryRegistry