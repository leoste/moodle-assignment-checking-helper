import type * as vscode from 'vscode'
import { announcer } from '@shared/announcer/Announcer'
import { reporter } from '@shared/reporter/Reporter'
import { outputChannelWatcher } from './watcher/OutputChannelWatcher'
import { statusBarWatcher } from './watcher/StatusBarWatcher'
import { statusBarButtonWatcher } from './watcher/StatusBarButtonWatcher'
import { notificationWatcher } from './watcher/NotificationWatcher'
import { newsClient } from './client/NewsClient'
import initInfrastructure from './infrastructure/init-infrastructure'
import closeInfrastructure from './infrastructure/close-infrastructure'
import initRepositories from './repository/init-repositories'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
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
