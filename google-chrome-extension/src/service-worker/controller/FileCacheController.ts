import { FILES_GET_SOURCES, FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import ChromeMessageController from './ChromeMessageController'
import { fileCacheService } from '../service/FileCacheService'

class FileCacheController extends ChromeMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(FILES_GET_SOURCES, async () =>
      fileCacheService.getFileSources()
    )

    this.addMessageHandler(FILES_UPDATE_CACHE, async (content) => {
      const { cacheKey, files } = content as { cacheKey: string; files: string[] }
      await fileCacheService.updateCache(cacheKey, files)
    })
  }
}

export const fileCacheController = new FileCacheController()
