export interface ILogger {
  debug(message: string): void
  error(message: string, trace?: any): void
}
