import Initialisable from '@shared/Initialisable'

export default abstract class BaseRepository extends Initialisable {
  protected abstract getValue<T>(key: string): Promise<T | undefined>
  protected abstract setValue<T>(key: string, value: T): Promise<void>
  protected abstract removeValue(key: string): Promise<void>
}
