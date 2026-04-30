import type { CommonAnswer } from '../../types'
import { commonAnswerRepository } from '../repository/CommonAnswerRepository'
import BaseService from './BaseService'

export default class CommonAnswerService extends BaseService {
  async getAll(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    return commonAnswerRepository.getAll(assignmentId)
  }
}

export const commonAnswerService = new CommonAnswerService()