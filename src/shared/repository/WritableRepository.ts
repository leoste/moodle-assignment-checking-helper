import BaseRepository from './BaseRepository'

// Stores values under the keys of its schema.
export default abstract class WritableRepository<TSchema> extends BaseRepository {
  protected abstract getValue<K extends keyof TSchema>(key: K): Promise<TSchema[K] | undefined>
  protected abstract setValue<K extends keyof TSchema>(key: K, value: TSchema[K]): Promise<void>
  protected abstract removeValue(key: keyof TSchema): Promise<void>
}
