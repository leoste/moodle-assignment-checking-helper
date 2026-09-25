import type BaseService from '@shared/service/BaseService'
import { pageInfoService } from './PageInfoService'
import { pythonRunnerService } from './PythonRunnerService'

export const services: readonly BaseService[] = [
  pageInfoService,
  pythonRunnerService,
]

export default function initServices(): void {
  services.forEach(service => service.init())
}
