import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { userContext } from '../context/user.context'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler().name
    const className = context.getClass().name
    const startTime = Date.now()

    const user = userContext.getStore()

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime

          if (user) {
            this.logger.log({
              userId: user.id,
              email: user.email,
              action: `${className}.${handler}`,
              duration,
              timestamp: new Date().toISOString()
            })
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime

          if (user) {
            this.logger.error({
              userId: user.id,
              email: user.email,
              action: `${className}.${handler}`,
              duration,
              error: error.message,
              timestamp: new Date().toISOString()
            })
          }
        }
      })
    )
  }
}