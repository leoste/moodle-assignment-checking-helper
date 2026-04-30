import type { Config } from '../../types'
import { configRepository } from '../repository/ConfigRepository'
import BaseService from './BaseService'

class ConfigService extends BaseService {
  async getConfig(): Promise<Config> {
    return configRepository.getConfig()
  }

  async setConfig(config: Partial<Config>): Promise<void> {
    return configRepository.setConfig(config)
  }
}

export const configService = new ConfigService()
