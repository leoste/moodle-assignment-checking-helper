import { logger } from '@shared/logging/logger'
import { infrastructure } from './init-infrastructure'

export default function closeInfrastructure(): void {
  infrastructure.forEach(item => {
    item.close()
    logger.info(item, 'closed')
  })
}
