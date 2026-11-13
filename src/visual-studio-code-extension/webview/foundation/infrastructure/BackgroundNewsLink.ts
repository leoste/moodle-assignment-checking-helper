import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { newsPool } from '@shared/foundation/object/NewsPool'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'
import type { NewsLink } from '@shared/business/types/NewsLink'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import { vsCodeApiProvider } from './VsCodeApiProvider'
import { webviewMessageReceiver } from './WebviewMessageReceiver'
import { newsWebviewMessageGenerator } from '../../../shared/foundation/generator/NewsWebviewMessageGenerator'
import { NEWS_REPORT } from '../../../shared/foundation/constants/webview-messages'

// Links the sidebar's pool to the background's pool.
class BackgroundNewsLink extends BaseInfrastructure implements NewsLink {
  readonly #announcers = new Set<string>()

  protected override onInit(): undefined {
    newsPool.setLink(this)
    webviewMessageReceiver.addHandler(NEWS_REPORT, async ({ announcer, news }: NewsPayload) => {
      if (this.#announcers.has(announcer)) newsPool.receive({ announcer, news })
    })
  }

  subscribe(announcers: readonly string[]): void {
    announcers.forEach(announcer => this.#announcers.add(announcer))
    void this.#receiveBriefing(announcers)
  }

  unsubscribe(announcers: readonly string[]): void {
    announcers.forEach(announcer => this.#announcers.delete(announcer))
  }

  // Empty when the background couldn't answer.
  async #receiveBriefing(announcers: readonly string[]): Promise<void> {
    const briefing = await vsCodeApiProvider.post(newsWebviewMessageGenerator.getSubscribeMessage(announcers)) as AnnouncedNews[] | undefined
    newsPool.receiveBriefing((briefing ?? []).filter(({ announcer }) => this.#announcers.has(announcer)))
  }
}

export const backgroundNewsLink = new BackgroundNewsLink()
