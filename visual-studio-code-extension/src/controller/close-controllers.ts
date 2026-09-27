import { logger } from '@shared/logging/logger'
import { controllers } from './init-controllers'

export default function closeControllers(): void {
  controllers.forEach(controller => {
    controller.close()
    logger.info(controller, 'closed')
  })
}
