import type BaseRepository from '../../shared/repository/BaseRepository'
import { assignmentRepository } from './AssignmentRepository'
import { quizRepository } from './QuizRepository'

export const repositories: readonly BaseRepository<unknown>[] = [
  assignmentRepository,
  quizRepository,
]

export default function initRepositories(): void {
  repositories.forEach(repository => repository.init())
}
