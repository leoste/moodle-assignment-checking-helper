import { announcer } from '@shared/communication/announcer/Announcer'
import { controllers } from './init-controllers'

export default function closeControllers(): void {
  controllers.forEach(controller => {
    controller.close()
    announcer.announceLog(controller, 'closed')
  })
}
