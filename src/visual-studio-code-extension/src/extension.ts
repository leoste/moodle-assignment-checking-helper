import * as vscode from 'vscode'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import StatusSinkGroup from '@shared/reporting/StatusSinkGroup'
import { translations } from '@shared/translations/translations'
import OutputChannelLogSink from './reporting/OutputChannelLogSink'
import StatusBarSink from './reporting/StatusBarSink'
import SidebarStatusSink from './reporting/SidebarStatusSink'
import { SHOW_LOG_COMMAND } from './config'
import initInfrastructure from './infrastructure/init-infrastructure'
import closeInfrastructure from './infrastructure/close-infrastructure'
import initRepositories from './repository/init-repositories'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel(translations.extension.name)
  logger.init(new OutputChannelLogSink(outputChannel))

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  statusBarItem.command = SHOW_LOG_COMMAND
  statusReporter.setSink(new StatusSinkGroup([new StatusBarSink(statusBarItem), new SidebarStatusSink()]))
  const showLogCommand = vscode.commands.registerCommand(SHOW_LOG_COMMAND, () => outputChannel.show())

  initInfrastructure()
  initRepositories()
  initServices()
  initControllers()
  logger.info('extension', 'activated')

  context.subscriptions.push(showLogCommand, statusBarItem, {
    dispose: () => {
      closeControllers()
      closeInfrastructure()
      outputChannel.dispose()
    },
  })
}

export function deactivate(): void {}
