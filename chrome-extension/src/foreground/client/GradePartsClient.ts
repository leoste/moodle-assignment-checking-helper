import type { GradePart } from '../../types'
import BaseClient from "./BaseClient"

export default class GradePartsClient extends BaseClient {
  static readonly #TYPE = 'assignment/grade-parts/get'

  async getData(assignmentId: string): Promise<GradePart[]> {
    const msg = this.makeMessage(GradePartsClient.#TYPE, { assignmentId })
    return chrome.runtime.sendMessage(msg) as Promise<GradePart[]>
  }
}