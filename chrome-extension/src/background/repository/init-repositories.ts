import { commonAnswerRepository } from "./CommonAnswerRepository";
import { gradePartRepository } from "./GradePartRepository";
import { quizRepository } from "./QuizRepository";

export default function initRepositories(): void {
  commonAnswerRepository.init()
  gradePartRepository.init()
  quizRepository.init()
}
