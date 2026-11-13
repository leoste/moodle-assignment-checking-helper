import WebviewMessageGenerator from './WebviewMessageGenerator'
import { NEWS_REPORT, NEWS_SUBSCRIBE } from '../../foundation/constants/webview-messages'
import type { WebviewMessage } from '../../business/types/WebviewMessage'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import type { NewsSubscribePayload } from '@shared/business/types/NewsSubscribePayload'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'

class NewsWebviewMessageGenerator extends WebviewMessageGenerator {
  getSubscribeMessage(announcers: readonly string[]): WebviewMessage<NewsSubscribePayload> {
    return this.makeMessage(NEWS_SUBSCRIBE, { announcers })
  }

  getReportMessage({ announcer, news }: AnnouncedNews): WebviewMessage<NewsPayload> {
    return this.makeMessage(NEWS_REPORT, { announcer, news })
  }
}

export const newsWebviewMessageGenerator = new NewsWebviewMessageGenerator()
