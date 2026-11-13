import BaseStatusAnnouncer from './BaseStatusAnnouncer'
import { ANNOUNCER_DEFINITIONS } from '../../foundation/constants/news'

class DefinitionsAnnouncer extends BaseStatusAnnouncer {
  constructor() {
    super(ANNOUNCER_DEFINITIONS)
  }
}

export const definitionsAnnouncer = new DefinitionsAnnouncer()
