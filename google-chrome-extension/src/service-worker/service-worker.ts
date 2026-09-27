import { logger } from '@shared/logging/logger'
import ConsoleLogSink from '@shared/logging/ConsoleLogSink'
import initInfrastructure from './infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './controller/init-controllers'

// Must stay synchronous: when a message wakes the service worker, Chrome delivers it only to
// listeners registered during this initial run. Awaiting anything here would lose that message.
logger.init(new ConsoleLogSink())
initInfrastructure()
initRepositories()
initServices()
initControllers()
