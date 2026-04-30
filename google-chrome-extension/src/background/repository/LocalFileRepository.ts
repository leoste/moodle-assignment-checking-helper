import LocalStorageRepository from './LocalStorageRepository'

export const DEFINITIONS_CACHE_KEY = 'definitions-files-cache'

export default abstract class LocalFileRepository extends LocalStorageRepository {
  protected async getAllFileContent(): Promise<string[]> {
    return (await this.getValue<string[]>(DEFINITIONS_CACHE_KEY)) ?? []
  }
}
