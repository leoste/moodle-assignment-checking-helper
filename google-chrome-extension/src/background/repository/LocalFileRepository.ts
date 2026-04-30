import { OFFSCREEN_READ_FILES } from '../../constants/messages'
import BaseRepository from './BaseRepository'

const OFFSCREEN_URL = 'src/offscreen/offscreen.html'

export default abstract class LocalFileRepository extends BaseRepository {
  protected async getAllFileContent(): Promise<string[]> {
    await ensureOffscreenDocument()
    return new Promise<string[]>((resolve) => {
      chrome.runtime.sendMessage({ type: OFFSCREEN_READ_FILES }, (response: unknown) => {
        if (chrome.runtime.lastError) {
          console.warn('LocalFileRepository: offscreen error', chrome.runtime.lastError.message)
          resolve([])
          return
        }
        resolve((response as string[]) ?? [])
      })
    })
  }
}

async function ensureOffscreenDocument(): Promise<void> {
  const hasDoc = await chrome.offscreen.hasDocument()
  if (!hasDoc) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_URL,
      reasons: [chrome.offscreen.Reason.BLOBS],
      justification: 'Read local definition files via File System Access API',
    })
  }
}
