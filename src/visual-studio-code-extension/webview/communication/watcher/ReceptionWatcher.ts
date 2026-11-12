import BaseWatcher from '@shared/communication/watcher/BaseWatcher'
import type { News } from '@shared/business/types/News'
import { NEWS_TYPE_RECEPTION } from '@shared/foundation/constants/news'
import type SidebarRenderer from '../../presentation/renderer/SidebarRenderer'

// The sidebar's take-over button, usable only in a window that doesn't receive the students.
class ReceptionWatcher extends BaseWatcher {
  #sidebar: SidebarRenderer | undefined
  #receiving: boolean | undefined

  setSidebar(sidebar: SidebarRenderer): void {
    this.#sidebar = sidebar
    this.#show()
  }

  watch(news: News): void {
    if (news.type !== NEWS_TYPE_RECEPTION) return
    this.#receiving = news.receiving
    this.#show()
  }

  #show(): void {
    if (this.#receiving !== undefined) this.#sidebar?.setReceiving(this.#receiving)
  }
}

export const receptionWatcher = new ReceptionWatcher()
