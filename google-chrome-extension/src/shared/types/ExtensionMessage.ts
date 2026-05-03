export interface ExtensionMessage<T = Record<string, unknown>> {
  type: string
  content: T
}
