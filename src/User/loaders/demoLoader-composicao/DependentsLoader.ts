import { Injectable, Scope } from '@nestjs/common'
import { CachedBatchLoader } from '@/User/loaders/demoLoader-composicao/CachedBatchLoader'
import { Dependents } from '@/Dependents/graphql/models/dependents'
import { PrismaService } from '@/database/prisma/prisma.service'
import { CacheService } from '@/cache/cache.service'

@Injectable({ scope: Scope.REQUEST })
export class DependentsLoader {
  private loader: CachedBatchLoader<string, Dependents[]>

  constructor(private prismaService: PrismaService, cacheService: CacheService) {
    this.loader = new CachedBatchLoader(cacheService, async (userIds) => {
      const dependents = await this.prismaService.dependent.findMany({
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

  load(userId: string): Promise<Dependents[]> {
    return this.loader.load(userId)
  }
}
