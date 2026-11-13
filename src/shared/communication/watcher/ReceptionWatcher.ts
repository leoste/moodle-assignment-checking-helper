import RememberingWatcher from './RememberingWatcher'
import type BaseReporter from '../reporter/BaseReporter'
import { receptionReporter } from '../reporter/ReceptionReporter'
import type { News } from '../../business/types/News'
import { NEWS_TYPE_RECEPTION } from '../../foundation/constants/news'

// Whether this VS Code window receives the students.
class ReceptionWatcher extends RememberingWatcher<boolean> {
  #receiving: boolean | undefined

  protected getReporters(): readonly BaseReporter[] {
    return [receptionReporter]
  }

  protected remember(news: News): boolean {
    if (news.type !== NEWS_TYPE_RECEPTION) return false
    this.#receiving = news.receiving
    return true
  }

  protected recall(): boolean | undefined {
    return this.#receiving
  }

  protected forget(): void {
    this.#receiving = undefined
  }
}

export const receptionWatcher = new ReceptionWatcher()
