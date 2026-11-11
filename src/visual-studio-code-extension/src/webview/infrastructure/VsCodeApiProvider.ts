import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import type { WebviewMessage } from '../../shared/types/WebviewMessage'

class VsCodeApiProvider extends BaseInfrastructure {
  readonly #api = acquireVsCodeApi()

  postMessage(message: WebviewMessage): void {
    this.#api.postMessage(message)
  }
}

export const vsCodeApiProvider = new VsCodeApiProvider()
