import type * as vscode from 'vscode'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { outputChannelTyper } from './presentation/typer/OutputChannelTyper'
import { statusBarTyper } from './presentation/typer/StatusBarTyper'
import { statusBarButtonTyper } from './presentation/typer/StatusBarButtonTyper'
import { notificationTyper } from './presentation/typer/NotificationTyper'
import initInfrastructure from './foundation/infrastructure/init-infrastructure'
import closeInfrastructure from './foundation/infrastructure/close-infrastructure'
import initRepositories from './repository/init-repositories'
import initControllers from './communication/controller/init-controllers'
import closeControllers from './communication/controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  // The output channel typer starts before the infrastructure so that it writes the infrastructure's log too.
  // Its own first line comes before the output channel exists and is lost.
  outputChannelTyper.init()
  initInfrastructure()
  statusBarTyper.init()
  statusBarButtonTyper.init()
  notificationTyper.init()
  initRepositories()
  initServices()
  initControllers()
  logAnnouncer.announceLog('extension', 'activated')

  context.subscriptions.push({
    dispose: () => {
      closeControllers()
      closeInfrastructure()
    },
  })
}

export function deactivate(): void {}
