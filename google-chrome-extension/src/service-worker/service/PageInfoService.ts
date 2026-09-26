import BaseService from '@shared/service/BaseService'
import { PAGE_INFO_CHANNEL } from '@shared/constants/websocket'
import type { WebSocketResponseStatus } from '@shared/types/WebSocketProtocol'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'
import { chromeVsCodeClient } from '../client/ChromeVsCodeClient'

class PageInfoService extends BaseService {
  async postStudentName(studentName: string): Promise<WebSocketResponseStatus> {
    const payload: StudentNamePayload = { studentName }
    return chromeVsCodeClient.postMessage(PAGE_INFO_CHANNEL, payload)
  }
}

export const pageInfoService = new PageInfoService()
