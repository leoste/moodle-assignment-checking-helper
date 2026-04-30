import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../constants/messages'
import { fileCacheRepository } from '../repository/FileCacheRepository'
import type { FileSourceInfo } from '../../types'
import BaseController from './BaseController'

class FileRefreshController extends BaseController {
  readonly #sources: FileSourceInfo[] = []

  registerSource(source: FileSourceInfo): void {
    this.#sources.push(source)
  }

  override init(): void {
    // TODO: make this message transaction clearer semantically. it is built correctly but holy how annoying to understand
    super.init()
    this.addMessageHandler(FILES_GET_SOURCES, async () => this.#sources)
    this.addMessageHandler(FILES_UPDATE_CACHE, async (content) => {
      const { cacheKey, files } = content as { cacheKey: string; files: string[] }
      await fileCacheRepository.set(cacheKey, files)
    })
  }
}

export const fileRefreshController = new FileRefreshController()
