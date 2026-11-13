import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { newsPool } from '@shared/foundation/object/NewsPool'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'
import type { NewsSource } from '@shared/business/types/NewsSource'
import type { NewsSubscriber } from '@shared/business/types/NewsSubscriber'
import type { NewsSubscribePayload } from '@shared/business/types/NewsSubscribePayload'
import { sidebarViewProvider } from './SidebarViewProvider'
import { newsWebviewMessageGenerator } from '../../../shared/foundation/generator/NewsWebviewMessageGenerator'
import { NEWS_SUBSCRIBE } from '../../../shared/foundation/constants/webview-messages'

// The background's end of the sidebar's link.
class SidebarNewsLink extends BaseInfrastructure implements NewsSubscriber {
  protected override onInit(): undefined {
    sidebarViewProvider.addHandler(NEWS_SUBSCRIBE, async ({ announcers }: NewsSubscribePayload) => {
      const sources = this.#getSources(announcers)
      newsPool.subscribe(sources, this)
      return newsPool.getBriefing(sources)
    })
  }

  report(announced: AnnouncedNews): void {
    void sidebarViewProvider.post(newsWebviewMessageGenerator.getReportMessage(announced))
  }

  brief(briefing: readonly AnnouncedNews[]): void {
    briefing.forEach(announced => this.report(announced))
  }

  #getSources(announcers: readonly string[]): NewsSource[] {
    return announcers
      .map(announcer => newsPool.getSource(announcer))
      .filter((source): source is NewsSource => source !== undefined && !source.staysInPart)
  }
}

export const sidebarNewsLink = new SidebarNewsLink()
