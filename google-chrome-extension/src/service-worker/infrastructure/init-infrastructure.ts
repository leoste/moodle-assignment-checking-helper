import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { chromeMessageReceiver } from './ChromeMessageReceiver'
import { vsCodeConnectionProvider } from './VsCodeConnectionProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  chromeMessageReceiver,
  vsCodeConnectionProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
