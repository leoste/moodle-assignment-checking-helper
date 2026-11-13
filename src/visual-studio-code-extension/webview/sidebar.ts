import '@shared/business/styles/theme.css'
import './business/styles/sidebar.css'
import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { vsCodeApiProvider } from './foundation/infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './foundation/infrastructure/WebviewMessageReceiver'
import { backgroundNewsLink } from './foundation/infrastructure/BackgroundNewsLink'
import { sidebarPageListener } from './presentation/listener/SidebarPageListener'

consoleTyper.init()
consoleProvider.init()
vsCodeApiProvider.init()
webviewMessageReceiver.init()
backgroundNewsLink.init()
sidebarPageListener.init()
