import type BaseRepository from '@shared/repository/BaseRepository'
import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'

export const repositories: readonly BaseRepository[] = [
  directoryHandleRepository,
]

export default function initRepositories(): void {
  repositories.forEach(repository => repository.init())
}
