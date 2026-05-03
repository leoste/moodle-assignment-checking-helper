import * as vscode from 'vscode'
import initControllers from './controller/init-controllers'
import closeControllers from './controller/close-controllers'
import initServices from './service/init-services'

export function activate(context: vscode.ExtensionContext): void {
  console.log('Moodle Checking Helper: VS Code extension active.')
  initServices()
  initControllers()
  context.subscriptions.push({ dispose: () => closeControllers() })
}

export function deactivate(): void {}
