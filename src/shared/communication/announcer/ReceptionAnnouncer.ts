import BaseAnnouncer from './BaseAnnouncer'
import type { News } from '../../business/types/News'
import { ANNOUNCER_RECEPTION, NEWS_TYPE_RECEPTION } from '../../foundation/constants/news'

class ReceptionAnnouncer extends BaseAnnouncer {
  constructor() {
    super(ANNOUNCER_RECEPTION)
  }

  announceReception(receiving: boolean): void {
    this.announce({ type: NEWS_TYPE_RECEPTION, receiving })
  }

  override remember(_stillTrue: readonly News[], news: News): News[] {
    return [news]
  }
}

export const receptionAnnouncer = new ReceptionAnnouncer()
