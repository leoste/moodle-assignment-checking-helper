export interface MessageHandler {
  (content: Record<string, unknown>): Promise<unknown>
}
