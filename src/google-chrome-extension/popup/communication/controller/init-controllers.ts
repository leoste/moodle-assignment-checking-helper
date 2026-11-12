import type BaseController from '@shared/communication/controller/BaseController'
import { newsController } from '../../../shared/communication/controller/NewsController'

export const controllers: readonly BaseController[] = [
  newsController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
