import type { News } from '../../business/types/News'
import type { AnnouncedNews } from '../../business/types/AnnouncedNews'
import type { NewsLink } from '../../business/types/NewsLink'
import type { NewsSource } from '../../business/types/NewsSource'
import type { NewsSubscriber } from '../../business/types/NewsSubscriber'

// Announcers put their news in, and the subscribers of an announcer get it. Keeps every announcer's news that is
// still true, also the news that came over the link, for briefing the subscribers that come later.
export default class NewsPool {
  readonly #sources = new Map<string, NewsSource>()
  readonly #stillTrue = new Map<string, News[]>()
  readonly #stillTrueElsewhere = new Map<string, News[]>()
  readonly #subscribers = new Map<string, Set<NewsSubscriber>>()
  #link: NewsLink | undefined

  addSource(source: NewsSource): void {
    this.#sources.set(source.key, source)
  }

  getSource(key: string): NewsSource | undefined {
    return this.#sources.get(key)
  }

  setLink(link: NewsLink): void {
    this.#link = link
  }

  put(source: NewsSource, news: News): void {
    this.#stillTrue.set(source.key, source.remember(this.#stillTrue.get(source.key) ?? [], news))
    this.#report({ announcer: source.key, news })
  }

  subscribe(sources: readonly NewsSource[], subscriber: NewsSubscriber): void {
    const linked: string[] = []
    for (const source of sources) {
      const subscribers = this.#getSubscribers(source.key)
      if (subscribers.size === 0 && !source.staysInPart) linked.push(source.key)
      subscribers.add(subscriber)
    }
    if (linked.length > 0) this.#link?.subscribe(linked)
  }

  unsubscribe(sources: readonly NewsSource[], subscriber: NewsSubscriber): void {
    const unlinked: string[] = []
    for (const source of sources) {
      const subscribers = this.#subscribers.get(source.key)
      if (!subscribers || !subscribers.delete(subscriber) || subscribers.size > 0) continue
      this.#stillTrueElsewhere.delete(source.key)
      if (!source.staysInPart) unlinked.push(source.key)
    }
    if (unlinked.length > 0) this.#link?.unsubscribe(unlinked)
  }

  getBriefing(sources: readonly NewsSource[]): AnnouncedNews[] {
    return sources.flatMap(({ key }) => [
      ...this.#stillTrue.get(key) ?? [],
      ...this.#stillTrueElsewhere.get(key) ?? [],
    ].map(news => ({ announcer: key, news })))
  }

  // News that came over the link.
  receive(announced: AnnouncedNews): void {
    if (this.#rememberElsewhere(announced)) this.#report(announced)
  }

  // The news that is still true in the other part, which came over the link after subscribing.
  receiveBriefing(briefing: readonly AnnouncedNews[]): void {
    const briefings = new Map<NewsSubscriber, AnnouncedNews[]>()
    for (const announced of briefing) {
      if (!this.#rememberElsewhere(announced)) continue
      for (const subscriber of this.#subscribers.get(announced.announcer) ?? []) {
        briefings.set(subscriber, [...briefings.get(subscriber) ?? [], announced])
      }
    }
    briefings.forEach((news, subscriber) => subscriber.brief(news))
  }

  // The link was lost, so its news may not be true any more.
  forgetElsewhere(): void {
    this.#stillTrueElsewhere.clear()
  }

  #rememberElsewhere({ announcer, news }: AnnouncedNews): boolean {
    const source = this.#sources.get(announcer)
    if (!source || !this.#subscribers.get(announcer)?.size) return false
    this.#stillTrueElsewhere.set(announcer, source.remember(this.#stillTrueElsewhere.get(announcer) ?? [], news))
    return true
  }

  #report(announced: AnnouncedNews): void {
    [...this.#subscribers.get(announced.announcer) ?? []].forEach(subscriber => subscriber.report(announced))
  }

  #getSubscribers(key: string): Set<NewsSubscriber> {
    let subscribers = this.#subscribers.get(key)
    if (!subscribers) {
      subscribers = new Set()
      this.#subscribers.set(key, subscribers)
    }
    return subscribers
  }
}

export const newsPool = new NewsPool()
