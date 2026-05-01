import type { GradePart } from '../../shared/types'
import BaseClient from './BaseClient'
import { GRADE_PARTS_GET } from '../../shared/constants/messages'

export default class GradePartsClient extends BaseClient {
  async getData(assignmentId: string): Promise<GradePart[]> {
    const msg = this.makeMessage(GRADE_PARTS_GET, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<GradePart[]>
  }
}
