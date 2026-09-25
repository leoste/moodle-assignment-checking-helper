import { controllers } from './init-controllers'

export default function closeControllers(): void {
  controllers.forEach(controller => controller.close())
}
