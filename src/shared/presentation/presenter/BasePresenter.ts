export default abstract class BasePresenter {
  abstract start(): Promise<void>

  async stop(): Promise<void> {}
}
