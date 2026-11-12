import BaseWatcher from '@shared/watcher/BaseWatcher'
import type { News } from '@shared/types/News'
import { NEWS_TYPE_RECEPTION } from '@shared/constants/news'
import type SidebarRenderer from '../renderer/SidebarRenderer'

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
