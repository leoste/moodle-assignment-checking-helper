import { announcer } from '@shared/announcer/Announcer'
import { infrastructure } from './init-infrastructure'

export default function closeInfrastructure(): void {
  infrastructure.forEach(item => {
    item.close()
    announcer.announceLog(item, 'closed')
  })
}
