import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import PopupRenderer, { type PopupSource } from '../renderer/PopupRenderer'
import { fileCacheClient } from '../../communication/client/FileCacheClient'
import { assignmentClient } from '../../communication/client/AssignmentClient'
import { panelClient } from '../../communication/client/PanelClient'
import { newsClient } from '../../../shared/communication/client/NewsClient'
import { directoryHandleRepository } from '../../../shared/repository/DirectoryHandleRepository'
import { folderAccessService } from '../../service/FolderAccessService'
import type { FileSourceInfo } from '../../../shared/business/types/FileSourceInfo'
import type { FileSourceStatus } from '../../../shared/business/types/FileSourceStatus'
import { announcer } from '@shared/communication/announcer/Announcer'
import { statusLineWatcher } from '@shared/communication/watcher/StatusLineWatcher'
import {
  getBrokenDefinitionsStatus,
  getDefinitionsFolderStatus,
  getDefinitionsLoadingStatus,
  getNoFolderPermissionStatus,
  getPanelNotActivatedStatus,
} from '../../../shared/business/rules/status-rules'
import { STATUS_TOPIC_BROKEN_DEFINITIONS, STATUS_TOPIC_PANEL } from '@shared/foundation/constants/status'

export default class PopupPresenter extends BasePresenter {
  #renderer: PopupRenderer | undefined

  async start(): Promise<void> {
    void statusLineWatcher.follow(newsClient)
    const fileSources = await fileCacheClient.getFileSources()
    const sources: PopupSource[] = []
    for (const source of fileSources) {
      const handle = await directoryHandleRepository.getDirectoryHandle(source)
      sources.push({ source, folderName: handle ? handle.name : null })
    }
    announcer.announceLog(this, `${sources.length} file source(s)`, sources)

    this.#renderer = new PopupRenderer(sources, {
      onSelectFolder: this.#onSelectFolder,
      onRefresh: this.#onRefresh,
      onReloadPanel: this.#onReloadPanel,
    })
    await this.#renderer.render()
    statusLineWatcher.setStatusLine(this.#renderer.statusLine)
    await this.#showCacheState(fileSources)
  }

  async stop(): Promise<void> {
    await this.#renderer?.clear()
  }

  #onReloadPanel = async (): Promise<void> => {
    const reloaded = await panelClient.reloadPanel()
    announcer.announceLog(this, reloaded ? 'panel reloaded' : 'no panel to reload in the active tab')
    if (reloaded) announcer.announceStatusCleared(STATUS_TOPIC_PANEL)
    else announcer.announceStatus(getPanelNotActivatedStatus())
  }

  #onSelectFolder = async (source: FileSourceInfo): Promise<void> => {
    const handle = await folderAccessService.selectFolder(source)
    announcer.announceLog(this, handle ? `folder selected for ${source.cacheKey}: ${handle.name}` : `folder selection cancelled for ${source.cacheKey}`)
    if (!handle) return
    this.#renderer?.setFolderName(source, handle.name)

    this.#renderer?.setRefreshing(true)
    announcer.announceStatus(getDefinitionsLoadingStatus())
    const refreshed = await folderAccessService.refreshSource(source)
    announcer.announceLog(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no permission)'} after folder selection`)
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (refreshed) await assignmentClient.notifyAssignmentsUpdated()
    else announcer.announceStatus(getNoFolderPermissionStatus())
  }

  #onRefresh = async (): Promise<void> => {
    const sources = await fileCacheClient.getFileSources()
    this.#renderer?.setRefreshing(true)
    announcer.announceStatus(getDefinitionsLoadingStatus())
    let anyRefreshed = false
    let permissionRefused = false
    for (const source of sources) {
      const refreshed = await folderAccessService.refreshSource(source)
      announcer.announceLog(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no folder or no permission)'}`)
      if (refreshed) anyRefreshed = true
      else if (await directoryHandleRepository.getDirectoryHandle(source)) permissionRefused = true
    }
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (anyRefreshed) await assignmentClient.notifyAssignmentsUpdated()
    if (permissionRefused) announcer.announceStatus(getNoFolderPermissionStatus())
  }

  async #showCacheState(sources: FileSourceStatus[]): Promise<void> {
    const updatedAts = sources.map(s => s.updatedAt).filter(t => t !== null)
    this.#renderer?.setRefreshTime(updatedAts.length > 0 ? new Date(Math.max(...updatedAts)) : null)

    const { assignments, brokenFiles } = await assignmentClient.getAllAssignments()
    announcer.announceLog(this, `${assignments.length} definition(s)`)
    await this.#renderer?.renderDefinitions(assignments)

    const loaded = sources.every(s => s.updatedAt !== null)
    announcer.announceStatus(getDefinitionsFolderStatus(await this.#areFoldersChosen(sources), loaded, assignments.length))
    const brokenDefinitionsStatus = getBrokenDefinitionsStatus(brokenFiles)
    if (brokenDefinitionsStatus) announcer.announceStatus(brokenDefinitionsStatus)
    else announcer.announceStatusCleared(STATUS_TOPIC_BROKEN_DEFINITIONS)
  }

  async #areFoldersChosen(sources: FileSourceInfo[]): Promise<boolean> {
    for (const source of sources) {
      if (!await directoryHandleRepository.getDirectoryHandle(source)) return false
    }
    return true
  }
}
