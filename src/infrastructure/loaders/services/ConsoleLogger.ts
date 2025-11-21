import type { ILogger } from '../interfaces/ILogger'

export class ConsoleLogger implements ILogger {
  debug(message: string): void {
    console.log(message)
  }

  error(message: string, trace?: any): void {
    console.error(message, trace)
  }
}