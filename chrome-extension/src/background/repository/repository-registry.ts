import CommonAnswerRepository from './CommonAnswerRepository'
import GradePartRepository from './GradePartRepository'
import QuizRepository from './QuizRepository'

const repositoryRegistry = {
  commonAnswerRepository: new CommonAnswerRepository(),
  gradePartRepository: new GradePartRepository(),
  quizRepository: new QuizRepository(),
}

export default repositoryRegistry
