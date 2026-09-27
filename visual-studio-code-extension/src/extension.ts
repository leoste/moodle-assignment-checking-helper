import * as vscode from 'vscode'
import initInfrastructure from './infrastructure/init-infrastructure'
import closeInfrastructure from './infrastructure/close-infrastructure'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  console.log('Moodle Checking Helper: VS Code extension active.')
  initInfrastructure()
  initServices()
  initControllers()
  context.subscriptions.push({
    dispose: () => {
      closeControllers()
      closeInfrastructure()
    },
  })
}

export function deactivate(): void {}
