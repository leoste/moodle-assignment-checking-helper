// Connects the pool to the pool of the part where the announcers' other news comes from.
export interface NewsLink {
  subscribe(announcers: readonly string[]): void
  unsubscribe(announcers: readonly string[]): void
}
