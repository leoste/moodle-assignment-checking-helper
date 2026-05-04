import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import FileCacheRepository from '../repository/FileCacheRepository'
import ChromeExtensionMessageController from './ChromeExtensionMessageController'

class FileCacheController extends ChromeExtensionMessageController {
  protected override async onInit(): Promise<void> {
    
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

export const fileRefreshController = new FileCacheController()
