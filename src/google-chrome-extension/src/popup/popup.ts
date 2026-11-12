// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being linked in popup.html.
import '@shared/styles/theme.css'
import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import initInfrastructure from './infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './controller/init-controllers'
import PopupPresenter from './presenter/PopupPresenter'

reporter.addWatcher(consoleWatcher)
reporter.addWatcher(statusLineWatcher)
initInfrastructure()
initRepositories()
initServices()
initControllers()
new PopupPresenter().start()
