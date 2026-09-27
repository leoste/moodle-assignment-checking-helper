import { infrastructure } from './init-infrastructure'

export default function closeInfrastructure(): void {
  infrastructure.forEach(item => item.close())
}
