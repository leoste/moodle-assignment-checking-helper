import ChromeMessageGenerator from './ChromeMessageGenerator'
import { NEWS_REPORT, NEWS_SUBSCRIBE } from '../../foundation/constants/messages'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import type { NewsSubscribePayload } from '@shared/business/types/NewsSubscribePayload'
import type { AnnouncedNews } from '@shared/business/types/AnnouncedNews'
import type { ChromeMessage } from '../../business/types/ChromeMessage'

class NewsChromeMessageGenerator extends ChromeMessageGenerator {
  getSubscribeMessage(announcers: readonly string[]): ChromeMessage<NewsSubscribePayload> {
    return this.makeMessage(NEWS_SUBSCRIBE, { announcers })
  }

  getReportMessage({ announcer, news }: AnnouncedNews): ChromeMessage<NewsPayload> {
    return this.makeMessage(NEWS_REPORT, { announcer, news })
  }
}

export const newsChromeMessageGenerator = new NewsChromeMessageGenerator()
