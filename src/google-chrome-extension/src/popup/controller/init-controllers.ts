import type BaseController from '@shared/controller/BaseController'
import { newsController } from '../../shared/controller/NewsController'

export const controllers: readonly BaseController[] = [
  newsController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
