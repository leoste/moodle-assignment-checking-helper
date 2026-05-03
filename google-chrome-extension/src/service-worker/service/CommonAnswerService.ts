import type { CommonAnswer } from '../../shared/types'
import { commonAnswerRepository } from '../repository/CommonAnswerRepository'
import BaseService from '@shared/service/BaseService'

/*
TODO: important changes before can add features!
CommonAnswer and GradePart need to be connected into Assignment. this means connecting their services and repositories too.
at repository side, it means deleting gradepart and commonanswer repositories almost, cause assignmentrepository already retrieves both.
service methods need to be moved together into new service though.
*/

export default class CommonAnswerService extends BaseService {
  async getAll(assignmentId: string): Promise<CommonAnswer[] | undefined> {
    return commonAnswerRepository.getAll(assignmentId)
  }
}

export const commonAnswerService = new CommonAnswerService()