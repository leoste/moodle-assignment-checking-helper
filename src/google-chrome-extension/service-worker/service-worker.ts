import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import initInfrastructure from './foundation/infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './communication/controller/init-controllers'

// Must stay synchronous: when a message wakes the service worker, Chrome delivers it only to
// listeners registered during this initial run. Awaiting anything here would lose that message.
consoleTyper.init()
initInfrastructure()
initRepositories()
initServices()
initControllers()
