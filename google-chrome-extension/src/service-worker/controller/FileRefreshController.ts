import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import FileCacheRepository from '../repository/FileCacheRepository'
import BaseController from './BaseController'

class FileRefreshController extends BaseController {
  override init(): void {
    // TODO: make this message transaction clearer semantically. it is built correctly but holy how annoying to understand
    super.init()
    this.addMessageHandler(FILES_GET_SOURCES, async () =>
      FileCacheRepository.getRegistry().map(r => r.fileSourceInfo)
    )
    this.addMessageHandler(FILES_UPDATE_CACHE, async (content) => {
      const { cacheKey, files } = content as { cacheKey: string; files: string[] }
      const repo = FileCacheRepository.getRegistry().find(r => r.fileSourceInfo.cacheKey === cacheKey)
      await repo?.setFileContents(files)
    })
  }
}

export const fileRefreshController = new FileRefreshController()
