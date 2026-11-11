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
