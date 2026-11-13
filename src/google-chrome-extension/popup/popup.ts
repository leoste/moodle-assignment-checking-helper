// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being linked in popup.html.
import '@shared/business/styles/theme.css'
import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import initInfrastructure from './foundation/infrastructure/init-infrastructure'
import initRepositories from './repository/init-repositories'
import initServices from './service/init-services'
import initControllers from './communication/controller/init-controllers'
import PopupPresenter from './presentation/presenter/PopupPresenter'

consoleTyper.init()
initInfrastructure()
initRepositories()
initServices()
initControllers()
new PopupPresenter().start()
