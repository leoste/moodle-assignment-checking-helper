import type BaseRepository from '@shared/repository/BaseRepository'
import { assignmentRepository } from './AssignmentRepository'
import { quizRepository } from './QuizRepository'
import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'

export const repositories: readonly BaseRepository<unknown>[] = [
  assignmentRepository,
  quizRepository,
  directoryHandleRepository,
]

export default function initRepositories(): void {
  repositories.forEach(repository => repository.init())
}
