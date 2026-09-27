import initServices from './service/init-services'
import PopupPresenter from './presenter/PopupPresenter'

initServices()
new PopupPresenter().start()
