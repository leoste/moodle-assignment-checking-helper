import type BaseController from '@shared/communication/controller/BaseController'

export const controllers: readonly BaseController[] = []

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
