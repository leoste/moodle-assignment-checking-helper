import { announcer } from '@shared/announcer/Announcer'
import { controllers } from './init-controllers'

export default function closeControllers(): void {
  controllers.forEach(controller => {
    controller.close()
    announcer.announceLog(controller, 'closed')
  })
}
