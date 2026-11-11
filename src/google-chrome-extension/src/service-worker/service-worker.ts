import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { statusReporter } from '@shared/reporting/statusReporter'
import PortStatusSink from './reporting/PortStatusSink'
import initInfrastructure from './infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './controller/init-controllers'

// Must stay synchronous: when a message wakes the service worker, Chrome delivers it only to
// listeners registered during this initial run. Awaiting anything here would lose that message.
logger.init(new ConsoleLogSink())
statusReporter.setSink(new PortStatusSink())
initInfrastructure()
initRepositories()
initServices()
initControllers()
