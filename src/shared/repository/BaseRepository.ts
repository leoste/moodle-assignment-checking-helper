import Initialisable from '../Initialisable'

export default abstract class BaseRepository<TSchema> extends Initialisable {
  protected abstract getValue<K extends keyof TSchema>(key: K): Promise<TSchema[K] | undefined>
  protected abstract setValue<K extends keyof TSchema>(key: K, value: TSchema[K]): Promise<void>
  protected abstract removeValue(key: keyof TSchema): Promise<void>
}
