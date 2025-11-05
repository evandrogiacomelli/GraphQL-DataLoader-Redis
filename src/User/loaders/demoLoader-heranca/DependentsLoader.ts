import { Injectable, Scope } from '@nestjs/common'
import { PrismaService } from '@/database/prisma/prisma.service'
import { CacheService } from '@/cache/cache.service'
import { Dependents } from '@/Dependents/graphql/models/dependents'
import { RevLoader } from '@/User/loaders/demoLoader-heranca/RevLoader'
import { RedisService } from '@/User/loaders/demoLoader-heranca/RedisBatchLoader'

@Injectable({ scope: Scope.REQUEST })
export class DependentsLoader extends RevLoader {

  constructor(
    private prismaService: PrismaService,
    cacheService: CacheService
  ) {
    const redisService = new RedisService(cacheService)

    super(redisService, async (userIds) => {
      const dependents = await prismaService.dependent.findMany({
        where: { userId: { in: [...userIds] } },
      })

      const map = new Map<string, Dependents[]>()
      userIds.forEach((userId) => map.set(userId, []))

      for (const dependent of dependents) {
        map.get(dependent.userId)?.push(dependent)
      }

      return userIds.map((userId) => map.get(userId)!)
    })
  }
}
