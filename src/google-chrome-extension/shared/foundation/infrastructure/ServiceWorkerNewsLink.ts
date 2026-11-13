import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { newsPool } from '@shared/foundation/object/NewsPool'
import { connectionAnnouncer } from '@shared/communication/announcer/ConnectionAnnouncer'
import { getWaitingStatus } from '@shared/business/rules/status-rules'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'
import type { NewsLink } from '@shared/business/types/NewsLink'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import { chromePortProvider } from './ChromePortProvider'
import { newsChromeMessageGenerator } from '../generator/NewsChromeMessageGenerator'
import { NEWS_REPORT } from '../constants/messages'

// Links the panel's or the popup's pool to the service worker's pool over the port. The port is opened by the
// first subscription and closed when nothing is subscribed any more.
class ServiceWorkerNewsLink extends BaseInfrastructure implements NewsLink {
  readonly #announcers = new Set<string>()

  protected override onInit(): undefined {
    newsPool.setLink(this)
    chromePortProvider.addHandler(NEWS_REPORT, async ({ announcer, news }: NewsPayload) => {
      if (this.#announcers.has(announcer)) newsPool.receive({ announcer, news })
    })
    // When Chrome stops the idle service worker, its WebSocket to VS Code closes together with the port,
    // so a closed port means the connection is waiting.
    chromePortProvider.setLostHandler(() => {
      this.#announcers.clear()
      newsPool.forgetElsewhere()
      connectionAnnouncer.announceStatus(getWaitingStatus())
    })
  }

  subscribe(announcers: readonly string[]): void {
    announcers.forEach(announcer => this.#announcers.add(announcer))
    void this.#receiveBriefing(announcers)
  }

  unsubscribe(announcers: readonly string[]): void {
    announcers.forEach(announcer => this.#announcers.delete(announcer))
    if (this.#announcers.size === 0) chromePortProvider.disconnect()
  }

  // Empty when the service worker couldn't answer.
  async #receiveBriefing(announcers: readonly string[]): Promise<void> {
    const briefing = await chromePortProvider.post(newsChromeMessageGenerator.getSubscribeMessage(announcers)) as AnnouncedNews[] | undefined
    newsPool.receiveBriefing((briefing ?? []).filter(({ announcer }) => this.#announcers.has(announcer)))
  }
}

export const serviceWorkerNewsLink = new ServiceWorkerNewsLink()
