import { PAGE_INFO_CHANNEL } from '@shared/constants/websocket'
import { pageInfoService } from '../service/PageInfoService'
import VsCodeWebSocketController from './VsCodeWebSocketController'

class PageInfoController extends VsCodeWebSocketController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(PAGE_INFO_CHANNEL, async (content) => {
      await pageInfoService.handlePageInfo(content.studentName as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
