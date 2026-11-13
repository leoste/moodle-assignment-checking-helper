import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import PopupRenderer, { type PopupSource } from '../renderer/PopupRenderer'
import { fileCacheClient } from '../../communication/client/FileCacheClient'
import { assignmentClient } from '../../communication/client/AssignmentClient'
import { panelClient } from '../../communication/client/PanelClient'
import { directoryHandleRepository } from '../../../shared/repository/DirectoryHandleRepository'
import { folderAccessService } from '../../service/FolderAccessService'
import type { FileSourceInfo } from '../../../shared/business/types/FileSourceInfo'
import type { FileSourceStatus } from '../../../shared/business/types/FileSourceStatus'
import type { Status } from '@shared/business/types/Status'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { definitionsAnnouncer } from '@shared/communication/announcer/DefinitionsAnnouncer'
import { statusWatcher } from '@shared/communication/watcher/StatusWatcher'
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
    const fileSources = await fileCacheClient.getFileSources()
    const sources: PopupSource[] = []
    for (const source of fileSources) {
      const handle = await directoryHandleRepository.getDirectoryHandle(source)
      sources.push({ source, folderName: handle ? handle.name : null })
    }
    logAnnouncer.announceLog(this, `${sources.length} file source(s)`, sources)

    this.#renderer = new PopupRenderer(sources, {
      onSelectFolder: this.#onSelectFolder,
      onRefresh: this.#onRefresh,
      onReloadPanel: this.#onReloadPanel,
    })
    await this.#renderer.render()
    statusWatcher.subscribe(this.#showStatuses)
    await this.#showCacheState(fileSources)
  }

  async stop(): Promise<void> {
    statusWatcher.unsubscribe(this.#showStatuses)
    await this.#renderer?.clear()
  }

  #showStatuses = (statuses: readonly Status[]): void => {
    this.#renderer?.statusLine.show(statuses)
  }

  #onReloadPanel = async (): Promise<void> => {
    const reloaded = await panelClient.reloadPanel()
    logAnnouncer.announceLog(this, reloaded ? 'panel reloaded' : 'no panel to reload in the active tab')
    if (reloaded) definitionsAnnouncer.announceStatusCleared(STATUS_TOPIC_PANEL)
    else definitionsAnnouncer.announceStatus(getPanelNotActivatedStatus())
  }

  #onSelectFolder = async (source: FileSourceInfo): Promise<void> => {
    const handle = await folderAccessService.selectFolder(source)
    logAnnouncer.announceLog(this, handle ? `folder selected for ${source.cacheKey}: ${handle.name}` : `folder selection cancelled for ${source.cacheKey}`)
    if (!handle) return
    this.#renderer?.setFolderName(source, handle.name)

    this.#renderer?.setRefreshing(true)
    definitionsAnnouncer.announceStatus(getDefinitionsLoadingStatus())
    const refreshed = await folderAccessService.refreshSource(source)
    logAnnouncer.announceLog(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no permission)'} after folder selection`)
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (refreshed) await assignmentClient.notifyAssignmentsUpdated()
    else definitionsAnnouncer.announceStatus(getNoFolderPermissionStatus())
  }

  #onRefresh = async (): Promise<void> => {
    const sources = await fileCacheClient.getFileSources()
    this.#renderer?.setRefreshing(true)
    definitionsAnnouncer.announceStatus(getDefinitionsLoadingStatus())
    let anyRefreshed = false
    let permissionRefused = false
    for (const source of sources) {
      const refreshed = await folderAccessService.refreshSource(source)
      logAnnouncer.announceLog(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no folder or no permission)'}`)
      if (refreshed) anyRefreshed = true
      else if (await directoryHandleRepository.getDirectoryHandle(source)) permissionRefused = true
    }
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (anyRefreshed) await assignmentClient.notifyAssignmentsUpdated()
    if (permissionRefused) definitionsAnnouncer.announceStatus(getNoFolderPermissionStatus())
  }

  async #showCacheState(sources: FileSourceStatus[]): Promise<void> {
    const updatedAts = sources.map(s => s.updatedAt).filter(t => t !== null)
    this.#renderer?.setRefreshTime(updatedAts.length > 0 ? new Date(Math.max(...updatedAts)) : null)

    const { assignments, brokenFiles } = await assignmentClient.getAllAssignments()
    logAnnouncer.announceLog(this, `${assignments.length} definition(s)`)
    await this.#renderer?.renderDefinitions(assignments)

    const loaded = sources.every(s => s.updatedAt !== null)
    definitionsAnnouncer.announceStatus(getDefinitionsFolderStatus(await this.#areFoldersChosen(sources), loaded, assignments.length))
    const brokenDefinitionsStatus = getBrokenDefinitionsStatus(brokenFiles)
    if (brokenDefinitionsStatus) definitionsAnnouncer.announceStatus(brokenDefinitionsStatus)
    else definitionsAnnouncer.announceStatusCleared(STATUS_TOPIC_BROKEN_DEFINITIONS)
  }

  async #areFoldersChosen(sources: FileSourceInfo[]): Promise<boolean> {
    for (const source of sources) {
      if (!await directoryHandleRepository.getDirectoryHandle(source)) return false
    }
    return true
  }
}
