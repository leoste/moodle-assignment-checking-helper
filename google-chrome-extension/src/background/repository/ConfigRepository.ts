import type { Config } from '../../types'
import IndexedDBRepository from './IndexedDBRepository'

const KEYS: { [K in keyof Required<Config>]: string } = {
  directoryHandle: 'config.directoryHandle',
}

class ConfigRepository extends IndexedDBRepository {
  async getConfig(): Promise<Config> {
    return {
      directoryHandle: await this.getValue<FileSystemDirectoryHandle>(KEYS.directoryHandle),
    }
  }

  async setConfig(config: Partial<Config>): Promise<void> {
    if (config.directoryHandle !== undefined) {
      await this.setValue(KEYS.directoryHandle, config.directoryHandle)
    }
  }
}

export const configRepository = new ConfigRepository()
