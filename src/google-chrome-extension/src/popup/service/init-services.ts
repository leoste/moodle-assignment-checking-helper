import type BaseService from '@shared/service/BaseService'
import { folderAccessService } from './FolderAccessService'

export const services: readonly BaseService[] = [
  folderAccessService,
]

export default function initServices(): void {
  services.forEach(service => service.init())
}
