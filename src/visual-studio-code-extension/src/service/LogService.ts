import BaseService from '@shared/service/BaseService'
import { outputChannelProvider } from '../infrastructure/OutputChannelProvider'

class LogService extends BaseService {
  showLog(): void {
    outputChannelProvider.show()
  }
}

export const logService = new LogService()
