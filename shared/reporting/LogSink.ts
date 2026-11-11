export interface LogSink {
  info(line: string, data?: unknown): void
  error(line: string, error?: unknown): void
}
