import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { translations } from '@shared/business/translations/translations'

// The extension's channel in VS Code's Output panel.
class OutputChannelProvider extends BaseInfrastructure {
  #channel: vscode.OutputChannel | undefined

  protected override onInit(): undefined {
    this.#channel = vscode.window.createOutputChannel(translations.extension.name)
  }

  appendLine(line: string): void {
    this.#channel?.appendLine(line)
  }

  show(): void {
    this.#channel?.show()
  }

  override close(): void {
    this.#channel?.dispose()
    this.#channel = undefined
  }
}

export const outputChannelProvider = new OutputChannelProvider()
