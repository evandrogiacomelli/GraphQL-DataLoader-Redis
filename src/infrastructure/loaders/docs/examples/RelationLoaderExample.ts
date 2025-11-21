import { Injectable, Scope } from '@nestjs/common'
import { RelationLoader } from '@/infrastructure/loaders'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { Dependent } from '@prisma/client'

@Injectable({ scope: Scope.REQUEST })
export class DependentsLoader extends RelationLoader<Dependent> {
  constructor(prisma: PrismaService, cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'dependents',
      groupByField: 'userId',
      fetchQuery: (userIds) => prisma.dependent.findMany({
        where: { userId: { in: userIds } }
      }),
      ttl: 3600,
      enableLogs: false,
      enableMetrics: true,
    })
  }
}