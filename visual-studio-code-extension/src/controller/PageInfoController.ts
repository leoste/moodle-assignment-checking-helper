import { PAGE_INFO_CHANNEL } from '@shared/constants/vscode-message'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'
import { pageInfoService } from '../service/PageInfoService'
import VsCodeMessageController from './VsCodeMessageController'

class PageInfoController extends VsCodeMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler<StudentNamePayload>(PAGE_INFO_CHANNEL, async ({ studentName }) => {
      await pageInfoService.handlePageInfo(studentName)
    })
  }
}

export const pageInfoController = new PageInfoController()
