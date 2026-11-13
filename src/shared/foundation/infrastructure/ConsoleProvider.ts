import BaseInfrastructure from './BaseInfrastructure'

class ConsoleProvider extends BaseInfrastructure {
  info(line: string, data?: unknown): void {
    if (data === undefined) console.info(line)
    else console.info(line, data)
  }

  error(line: string, error?: unknown): void {
    if (error === undefined) console.error(line)
    else console.error(line, error)
  }
}

export const consoleProvider = new ConsoleProvider()
