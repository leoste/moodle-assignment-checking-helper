import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { controllers } from './init-controllers'

export default function closeControllers(): void {
  controllers.forEach(controller => {
    controller.close()
    logAnnouncer.announceLog(controller, 'closed')
  })
}
