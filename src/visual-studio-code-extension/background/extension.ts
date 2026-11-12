import type * as vscode from 'vscode'
import { announcer } from '@shared/communication/announcer/Announcer'
import { reporter } from '@shared/communication/reporter/Reporter'
import { outputChannelWatcher } from './communication/watcher/OutputChannelWatcher'
import { statusBarWatcher } from './communication/watcher/StatusBarWatcher'
import { statusBarButtonWatcher } from './communication/watcher/StatusBarButtonWatcher'
import { notificationWatcher } from './communication/watcher/NotificationWatcher'
import { newsClient } from './communication/client/NewsClient'
import initInfrastructure from './foundation/infrastructure/init-infrastructure'
import closeInfrastructure from './foundation/infrastructure/close-infrastructure'
import initRepositories from './repository/init-repositories'
import initControllers from './communication/controller/init-controllers'
import closeControllers from './communication/controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  reporter.addWatcher(outputChannelWatcher)
  reporter.addWatcher(statusBarWatcher)
  reporter.addWatcher(statusBarButtonWatcher)
  reporter.addWatcher(notificationWatcher)
  reporter.addClient(newsClient)

  initInfrastructure()
  initRepositories()
  initServices()
  initControllers()
  announcer.announceLog('extension', 'activated')

  context.subscriptions.push({
    dispose: () => {
      closeControllers()
      closeInfrastructure()
    },
  })
}

export function deactivate(): void {}
