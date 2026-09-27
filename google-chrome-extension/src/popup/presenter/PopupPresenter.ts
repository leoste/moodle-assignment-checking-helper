import BasePresenter from '../../shared/presenter/BasePresenter'
import PopupRenderer, { type PopupSource } from '../renderer/PopupRenderer'
import { fileCacheClient } from '../client/FileCacheClient'
import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import { folderAccessService } from '../service/FolderAccessService'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'

export default class PopupPresenter extends BasePresenter {
  #renderer: PopupRenderer | undefined

  async start(): Promise<void> {
    const sources: PopupSource[] = []
    for (const source of await fileCacheClient.getFileSources()) {
      const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)
      sources.push({ source, folderName: handle ? handle.name : null })
    }

    this.#renderer = new PopupRenderer(sources, {
      onSelectFolder: this.#onSelectFolder,
      onRefresh: this.#onRefresh,
    })
    await this.#renderer.render()
  }

  async stop(): Promise<void> {
    await this.#renderer?.clear()
  }

  #onSelectFolder = async (source: FileSourceInfo): Promise<void> => {
    const handle = await folderAccessService.selectFolder(source)
    if (handle) this.#renderer?.setFolderName(source, handle.name)
  }

  #onRefresh = async (): Promise<void> => {
    const sources = await fileCacheClient.getFileSources()
    this.#renderer?.setRefreshing(true)
    for (const source of sources) {
      await folderAccessService.refreshSource(source)
    }
    this.#renderer?.setRefreshing(false)
  }
}
