import type { FileSourceInfo } from '../../shared/types'
import IndexedDBRepository from './IndexedDBRepository'

export default abstract class FileCacheRepository extends IndexedDBRepository {
  static readonly #registry: FileCacheRepository[] = []

  static getRegistry(): readonly FileCacheRepository[] {
    return FileCacheRepository.#registry
  }

  protected static register(instance: FileCacheRepository): void {
    FileCacheRepository.#registry.push(instance)
  }

  abstract readonly fileSourceInfo: FileSourceInfo

  async getFileContents(): Promise<string[]> {
    return (await this.getValue<string[]>(this.fileSourceInfo.cacheKey)) ?? []
  }

  async setFileContents(contents: string[]): Promise<void> {
    await this.setValue(this.fileSourceInfo.cacheKey, contents)
  }
}
