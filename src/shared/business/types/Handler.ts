// Handles what a receiver got for one key: a message's payload, a command's arguments.
export interface Handler<TContent> {
  (content: TContent): Promise<unknown>
}
