import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { newsPool } from '@shared/foundation/object/NewsPool'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'
import type { NewsSource } from '@shared/business/types/NewsSource'
import type { NewsSubscriber } from '@shared/business/types/NewsSubscriber'
import type { NewsSubscribePayload } from '@shared/business/types/NewsSubscribePayload'
import { chromePortReceiver } from './ChromePortReceiver'
import { newsChromeMessageGenerator } from '../../../shared/foundation/generator/NewsChromeMessageGenerator'
import { NEWS_SUBSCRIBE } from '../../../shared/foundation/constants/messages'

// The service worker's end of the links of the panels and the popup. A handler doesn't know which port a
// subscription came over, so the news goes to every open port, and each panel or popup keeps what it subscribed to.
class PageNewsLink extends BaseInfrastructure implements NewsSubscriber {
  protected override onInit(): undefined {
    chromePortReceiver.addHandler(NEWS_SUBSCRIBE, async ({ announcers }: NewsSubscribePayload) => {
      const sources = this.#getSources(announcers)
      newsPool.subscribe(sources, this)
      return newsPool.getBriefing(sources)
    })
  }

  report(announced: AnnouncedNews): void {
    void chromePortReceiver.postToAll(newsChromeMessageGenerator.getReportMessage(announced))
  }

  brief(briefing: readonly AnnouncedNews[]): void {
    briefing.forEach(announced => this.report(announced))
  }

  // Only the announcers that announce in the service worker are known here.
  #getSources(announcers: readonly string[]): NewsSource[] {
    return announcers
      .map(announcer => newsPool.getSource(announcer))
      .filter((source): source is NewsSource => source !== undefined && !source.staysInPart)
  }
}

export const pageNewsLink = new PageNewsLink()
