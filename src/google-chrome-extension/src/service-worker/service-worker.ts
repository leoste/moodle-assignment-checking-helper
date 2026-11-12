import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { newsClient } from './client/NewsClient'
import initInfrastructure from './infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './controller/init-controllers'

// Must stay synchronous: when a message wakes the service worker, Chrome delivers it only to
// listeners registered during this initial run. Awaiting anything here would lose that message.
reporter.addWatcher(consoleWatcher)
reporter.addClient(newsClient)
initInfrastructure()
initRepositories()
initServices()
initControllers()
