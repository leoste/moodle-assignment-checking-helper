import type BaseRepository from '@shared/repository/BaseRepository'
import { settingsRepository } from './SettingsRepository'

export const repositories: readonly BaseRepository<unknown>[] = [
  settingsRepository,
]

export default function initRepositories(): void {
  repositories.forEach(repository => repository.init())
}
