import * as vscode from 'vscode'
import { logger } from '@shared/logging/logger'
import { translations } from '@shared/translations/translations'
import OutputChannelLogSink from './logging/OutputChannelLogSink'
import initInfrastructure from './infrastructure/init-infrastructure'
import closeInfrastructure from './infrastructure/close-infrastructure'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel(translations.extension.name)
  logger.init(new OutputChannelLogSink(outputChannel))

  initInfrastructure()
  initServices()
  initControllers()
  logger.info('extension', 'activated')

  context.subscriptions.push({
    dispose: () => {
      closeControllers()
      closeInfrastructure()
      outputChannel.dispose()
    },
  })
}

export function deactivate(): void {}
