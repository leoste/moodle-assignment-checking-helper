// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being linked in popup.html.
import '@shared/styles/theme.css'
import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import initInfrastructure from './infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import PopupPresenter from './presenter/PopupPresenter'

logger.init(new ConsoleLogSink())
initInfrastructure()
initRepositories()
initServices()
new PopupPresenter().start()
