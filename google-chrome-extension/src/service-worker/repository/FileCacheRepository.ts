import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import type { FileCache } from '../../shared/types/FileCache'
import type { CachedFile } from '../../shared/types/CachedFile'
import IndexedDBRepository from '../../shared/repository/IndexedDBRepository'

export default abstract class FileCacheRepository extends IndexedDBRepository {
  static readonly #registry: FileCacheRepository[] = []

  static getRegistry(): readonly FileCacheRepository[] {
    return FileCacheRepository.#registry
  }

  abstract readonly fileSourceInfo: FileSourceInfo

  // Every file cache repository registers itself as a file source when initialised.
  // Subclasses overriding onInit must call super.onInit().
  protected override onInit(): undefined {
    FileCacheRepository.#registry.push(this)
  }

  async getFiles(): Promise<CachedFile[]> {
    return (await this.#getFileCache())?.files ?? []
  }

  async setFiles(files: CachedFile[]): Promise<void> {
    await this.setValue(this.fileSourceInfo.cacheKey, { files, updatedAt: Date.now() })
  }

  async getUpdatedAt(): Promise<number | null> {
    return (await this.#getFileCache())?.updatedAt ?? null
  }

  async #getFileCache(): Promise<FileCache | undefined> {
    const cache = await this.getValue(this.fileSourceInfo.cacheKey)
    // A cache stored before file names were kept has no `files` and counts as missing until the files are loaded again.
    return Array.isArray(cache?.files) ? cache : undefined
  }
}
