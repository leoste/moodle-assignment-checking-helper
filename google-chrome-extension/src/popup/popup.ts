import { logger } from '@shared/logging/logger'
import ConsoleLogSink from '@shared/logging/ConsoleLogSink'
import initServices from './service/init-services'
import PopupPresenter from './presenter/PopupPresenter'

logger.init(new ConsoleLogSink())
initServices()
new PopupPresenter().start()
