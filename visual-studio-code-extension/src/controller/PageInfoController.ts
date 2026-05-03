import { pageInfoService } from '../service/PageInfoService'
import VsCodeBaseController from './VsCodeBaseController'

class PageInfoController extends VsCodeBaseController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler('page-info', async (content) => {
      await pageInfoService.handlePageInfo(content as unknown as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
