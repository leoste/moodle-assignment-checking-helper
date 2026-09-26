import { PAGE_INFO_CHANNEL } from '@shared/constants/vscode-message'
import { pageInfoService } from '../service/PageInfoService'
import VsCodeMessageController from './VsCodeMessageController'

class PageInfoController extends VsCodeMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(PAGE_INFO_CHANNEL, async (content) => {
      await pageInfoService.handlePageInfo(content.studentName as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
