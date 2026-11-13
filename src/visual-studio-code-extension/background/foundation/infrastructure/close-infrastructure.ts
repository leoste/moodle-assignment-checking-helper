import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { infrastructure } from './init-infrastructure'

// In reverse order, so the output channel, which every closing is logged to, closes last.
export default function closeInfrastructure(): void {
  [...infrastructure].reverse().forEach(item => {
    item.close()
    logAnnouncer.announceLog(item, 'closed')
  })
}
