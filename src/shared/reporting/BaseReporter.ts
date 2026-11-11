// A reporter passes what the code reports on to a sink chosen by the context it runs in,
// e.g. the logger to the console or to VS Code's Output panel. Every extension bundle has its own reporters.
export default abstract class BaseReporter<TSink> {
  #sink: TSink | undefined

  protected setSink(sink: TSink): void {
    this.#sink = sink
  }

  protected hasSink(): boolean {
    return this.#sink !== undefined
  }

  protected get sink(): TSink {
    this.#sink ??= this.createFallbackSink()
    return this.#sink
  }

  protected abstract createFallbackSink(): TSink
}
