import type BaseRepository from '@shared/repository/BaseRepository'
import { settingsRepository } from './SettingsRepository'
import { studentSubmissionRepository } from './StudentSubmissionRepository'

export const repositories: readonly BaseRepository[] = [
  settingsRepository,
  studentSubmissionRepository,
]

export default function initRepositories(): void {
  repositories.forEach(repository => repository.init())
}
