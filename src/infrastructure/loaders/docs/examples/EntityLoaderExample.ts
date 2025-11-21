import { Injectable, Scope } from '@nestjs/common'
import { EntityLoader } from '@/infrastructure/loaders'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { User } from '@prisma/client'

@Injectable({ scope: Scope.REQUEST })
export class UserLoader extends EntityLoader<User> {
  constructor(prisma: PrismaService, cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'users',
      idField: 'id',
      fetchQuery: (userIds) => prisma.user.findMany({
        where: { id: { in: userIds } }
      }),
      ttl: 3600,
      enableLogs: false,
      enableMetrics: true,
    })
  }
}