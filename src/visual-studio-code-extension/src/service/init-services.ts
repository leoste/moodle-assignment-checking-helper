import type BaseService from '@shared/service/BaseService'
import { studentSubmissionService } from './StudentSubmissionService'
import { pythonRunnerService } from './PythonRunnerService'
import { settingsService } from './SettingsService'

export const services: readonly BaseService[] = [
  studentSubmissionService,
  pythonRunnerService,
  settingsService,
]

export default function initServices(): void {
  services.forEach(service => service.init())
}
