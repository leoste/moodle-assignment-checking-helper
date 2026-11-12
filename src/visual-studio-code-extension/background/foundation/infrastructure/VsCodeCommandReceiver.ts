import * as vscode from 'vscode'
import BaseReceiver from '@shared/foundation/infrastructure/BaseReceiver'
import type { Handler } from '@shared/business/types/Handler'
import VsCodeCommandHandlerMap from '../object/VsCodeCommandHandlerMap'
import type { VsCodeCommandHandler } from '../../business/types/VsCodeCommandHandler'

// Receives VS Code's commands, e.g. from a right-click menu or a status bar item. A command is registered with
// VS Code when its handler is added, and its arguments are passed on as they are. Nobody waits for a command's
// answer, so the respond methods do nothing.
class VsCodeCommandReceiver extends BaseReceiver<unknown[], VsCodeCommandHandler, undefined> {
  readonly #registrations = new Map<string, vscode.Disposable>()

  constructor() {
    super(new VsCodeCommandHandlerMap())
  }

  override addHandler<TArguments extends unknown[]>(command: string, handler: Handler<TArguments>): void {
    super.addHandler(command, handler)
    if (this.#registrations.has(command)) return
    this.#registrations.set(command, vscode.commands.registerCommand(command, (...args: unknown[]) => {
      void this.dispatch(command, args, undefined)
    }))
  }

  override close(): void {
    this.#registrations.forEach(registration => registration.dispose())
    this.#registrations.clear()
  }

  protected respondHandled(): void {}

  protected respondUnhandled(): void {}

  protected respondError(): void {}
}

export const vsCodeCommandReceiver = new VsCodeCommandReceiver()
