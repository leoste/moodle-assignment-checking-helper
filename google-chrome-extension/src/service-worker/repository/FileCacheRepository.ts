import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
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

  async getFileContents(): Promise<string[]> {
    return (await this.getValue<string[]>(this.fileSourceInfo.cacheKey)) ?? []
  }

  async setFileContents(contents: string[]): Promise<void> {
    await this.setValue(this.fileSourceInfo.cacheKey, contents)
    await this.setValue(this.#updatedAtKey(), Date.now())
  }

  async getUpdatedAt(): Promise<number | null> {
    return (await this.getValue<number>(this.#updatedAtKey())) ?? null
  }

  #updatedAtKey(): string {
    return `${this.fileSourceInfo.cacheKey}.updatedAt`
  }
}
