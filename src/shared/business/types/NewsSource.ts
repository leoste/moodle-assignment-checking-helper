import type { News } from './News'

// What the pool needs to know of an announcer.
export interface NewsSource {
  readonly key: string
  readonly staysInPart: boolean
  // Folds a new piece of news into the announcer's news that is still true.
  remember(stillTrue: readonly News[], news: News): News[]
}
