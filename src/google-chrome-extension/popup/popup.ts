// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being linked in popup.html.
import '@shared/business/styles/theme.css'
import { reporter } from '@shared/communication/reporter/Reporter'
import { consoleWatcher } from '@shared/communication/watcher/ConsoleWatcher'
import { statusLineWatcher } from '@shared/communication/watcher/StatusLineWatcher'
import initInfrastructure from './foundation/infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './communication/controller/init-controllers'
import PopupPresenter from './presentation/presenter/PopupPresenter'

reporter.addWatcher(consoleWatcher)
reporter.addWatcher(statusLineWatcher)
initInfrastructure()
initRepositories()
initServices()
initControllers()
new PopupPresenter().start()
