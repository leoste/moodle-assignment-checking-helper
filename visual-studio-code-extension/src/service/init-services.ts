import type BaseService from '@shared/service/BaseService'
import { studentSubmissionService } from './StudentSubmissionService'
import { pythonRunnerService } from './PythonRunnerService'

export const services: readonly BaseService[] = [
  studentSubmissionService,
  pythonRunnerService,
]

export default function initServices(): void {
  services.forEach(service => service.init())
}
