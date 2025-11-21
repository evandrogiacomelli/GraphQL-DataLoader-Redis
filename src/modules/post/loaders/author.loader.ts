import { Injectable, Scope } from '@nestjs/common'
import { EntityLoader } from '@/infrastructure/loaders'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { User } from '@prisma/client'

@Injectable({ scope: Scope.REQUEST })
export class AuthorLoader extends EntityLoader<User> {
  constructor(prisma: PrismaService, cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'authors',
      idField: 'id',
      fetchQuery: (authorIds) => prisma.user.findMany({
        where: { id: { in: authorIds } }
      }),
      ttl: 3600,
      enableLogs: true,
      enableMetrics: true,
    })
  }
}