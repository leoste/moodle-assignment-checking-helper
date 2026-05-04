import { pageInfoService } from '../service/PageInfoService'
import VsCodeWebSocketController from './VsCodeWebSocketController'

class PageInfoController extends VsCodeWebSocketController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler('page-info', async (content) => {
      await pageInfoService.handlePageInfo(content as unknown as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
