import BasePresenter from '@shared/presenter/BasePresenter'
import PopupRenderer, { type PopupSource } from '../renderer/PopupRenderer'
import { fileCacheClient } from '../client/FileCacheClient'
import { assignmentClient } from '../client/AssignmentClient'
import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'
import { folderAccessService } from '../service/FolderAccessService'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import type { FileSourceStatus } from '../../shared/types/FileSourceStatus'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { portStatusReceiver } from '../../shared/reporting/PortStatusReceiver'
import {
  getBrokenDefinitionsStatus,
  getDefinitionsFolderStatus,
  getDefinitionsLoadingStatus,
  getNoFolderPermissionStatus,
} from '../../shared/rules/status-rules'
import { STATUS_TOPIC_BROKEN_DEFINITIONS } from '@shared/constants/status'

export default class PopupPresenter extends BasePresenter {
  #renderer: PopupRenderer | undefined

  async start(): Promise<void> {
    portStatusReceiver.connect()
    const fileSources = await fileCacheClient.getFileSources()
    const sources: PopupSource[] = []
    for (const source of fileSources) {
      const handle = await directoryHandleRepository.getDirectoryHandle(source)
      sources.push({ source, folderName: handle ? handle.name : null })
    }
    logger.info(this, `${sources.length} file source(s)`, sources)

    this.#renderer = new PopupRenderer(sources, {
      onSelectFolder: this.#onSelectFolder,
      onRefresh: this.#onRefresh,
    })
    await this.#renderer.render()
    statusReporter.setSink(this.#renderer.statusLine)
    await this.#showCacheState(fileSources)
  }

  async stop(): Promise<void> {
    await this.#renderer?.clear()
  }

  #onSelectFolder = async (source: FileSourceInfo): Promise<void> => {
    const handle = await folderAccessService.selectFolder(source)
    logger.info(this, handle ? `folder selected for ${source.cacheKey}: ${handle.name}` : `folder selection cancelled for ${source.cacheKey}`)
    if (!handle) return
    this.#renderer?.setFolderName(source, handle.name)

    this.#renderer?.setRefreshing(true)
    statusReporter.report(getDefinitionsLoadingStatus())
    const refreshed = await folderAccessService.refreshSource(source)
    logger.info(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no permission)'} after folder selection`)
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (refreshed) await assignmentClient.notifyAssignmentsUpdated()
    else statusReporter.report(getNoFolderPermissionStatus())
  }

  #onRefresh = async (): Promise<void> => {
    const sources = await fileCacheClient.getFileSources()
    this.#renderer?.setRefreshing(true)
    statusReporter.report(getDefinitionsLoadingStatus())
    let anyRefreshed = false
    let permissionRefused = false
    for (const source of sources) {
      const refreshed = await folderAccessService.refreshSource(source)
      logger.info(this, `${source.cacheKey} ${refreshed ? 'refreshed' : 'not refreshed (no folder or no permission)'}`)
      if (refreshed) anyRefreshed = true
      else if (await directoryHandleRepository.getDirectoryHandle(source)) permissionRefused = true
    }
    this.#renderer?.setRefreshing(false)
    await this.#showCacheState(await fileCacheClient.getFileSources())
    if (anyRefreshed) await assignmentClient.notifyAssignmentsUpdated()
    if (permissionRefused) statusReporter.report(getNoFolderPermissionStatus())
  }

  async #showCacheState(sources: FileSourceStatus[]): Promise<void> {
    const updatedAts = sources.map(s => s.updatedAt).filter(t => t !== null)
    this.#renderer?.setRefreshTime(updatedAts.length > 0 ? new Date(Math.max(...updatedAts)) : null)

    const { assignments, brokenFiles } = await assignmentClient.getAllAssignments()
    logger.info(this, `${assignments.length} definition(s)`)
    await this.#renderer?.renderDefinitions(assignments)

    const loaded = sources.every(s => s.updatedAt !== null)
    statusReporter.report(getDefinitionsFolderStatus(await this.#areFoldersChosen(sources), loaded, assignments.length))
    const brokenDefinitionsStatus = getBrokenDefinitionsStatus(brokenFiles)
    if (brokenDefinitionsStatus) statusReporter.report(brokenDefinitionsStatus)
    else statusReporter.clear(STATUS_TOPIC_BROKEN_DEFINITIONS)
  }

  async #areFoldersChosen(sources: FileSourceInfo[]): Promise<boolean> {
    for (const source of sources) {
      if (!await directoryHandleRepository.getDirectoryHandle(source)) return false
    }
    return true
  }
}
