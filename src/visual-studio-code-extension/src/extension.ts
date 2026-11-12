import * as vscode from 'vscode'
import { announcer } from '@shared/announcer/Announcer'
import { reporter } from '@shared/reporter/Reporter'
import { translations } from '@shared/translations/translations'
import OutputChannelWatcher from './watcher/OutputChannelWatcher'
import StatusBarWatcher from './watcher/StatusBarWatcher'
import { newsClient } from './client/NewsClient'
import { SHOW_LOG_COMMAND } from './config'
import initInfrastructure from './infrastructure/init-infrastructure'
import closeInfrastructure from './infrastructure/close-infrastructure'
import initRepositories from './repository/init-repositories'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel(translations.extension.name)
  reporter.addWatcher(new OutputChannelWatcher(outputChannel))

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  statusBarItem.command = SHOW_LOG_COMMAND
  reporter.addWatcher(new StatusBarWatcher(statusBarItem))
  reporter.addClient(newsClient)
  const showLogCommand = vscode.commands.registerCommand(SHOW_LOG_COMMAND, () => outputChannel.show())

  initInfrastructure()
  initRepositories()
  initServices()
  initControllers()
  announcer.announceLog('extension', 'activated')

  context.subscriptions.push(showLogCommand, statusBarItem, {
    dispose: () => {
      closeControllers()
      closeInfrastructure()
      outputChannel.dispose()
    },
  })
}

export function deactivate(): void {}
