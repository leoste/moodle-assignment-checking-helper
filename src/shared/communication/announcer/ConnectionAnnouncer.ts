import BaseStatusAnnouncer from './BaseStatusAnnouncer'
import { ANNOUNCER_CONNECTION } from '../../foundation/constants/news'

class ConnectionAnnouncer extends BaseStatusAnnouncer {
  constructor() {
    super(ANNOUNCER_CONNECTION)
  }
}

export const connectionAnnouncer = new ConnectionAnnouncer()
