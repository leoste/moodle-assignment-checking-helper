import AsyncInitialisable from '@shared/AsyncInitialisable'

export default abstract class BaseRepository extends AsyncInitialisable {
  protected abstract getValue<T>(key: string): Promise<T | undefined>
  protected abstract setValue<T>(key: string, value: T): Promise<void>
  protected abstract removeValue(key: string): Promise<void>
}
