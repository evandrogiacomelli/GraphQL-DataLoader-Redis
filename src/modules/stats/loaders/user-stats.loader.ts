import { Injectable, Scope } from '@nestjs/common'
import { ProcessLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'

export interface UserStats {
  userId: string
  totalPosts: number
  totalDependents: number
  processingTime: number
  calculatedAt: Date
}

@Injectable({ scope: Scope.REQUEST })
export class UserStatsLoader extends ProcessLoader<UserStats> {
  constructor(
    private prisma: PrismaService,
    cacheService: CacheService
  ) {
    super(cacheService, {
      cachePrefix: 'user-stats',
      processFn: async (userIds) => {
        const startTime = Date.now()

        await new Promise(resolve => setTimeout(resolve, 2000))

        const [posts, dependents] = await Promise.all([
          this.prisma.post.groupBy({
            by: ['authorId'],
            where: { authorId: { in: userIds } },
            _count: { id: true }
          }),
          this.prisma.dependent.groupBy({
            by: ['userId'],
            where: { userId: { in: userIds } },
            _count: { id: true }
          })
        ])

        const postsMap = new Map(posts.map(p => [p.authorId, p._count.id]))
        const dependentsMap = new Map(dependents.map(d => [d.userId, d._count.id]))

        const map = new Map<string, UserStats>()

        for (const userId of userIds) {
          map.set(userId, {
            userId,
            totalPosts: postsMap.get(userId) || 0,
            totalDependents: dependentsMap.get(userId) || 0,
            processingTime: Date.now() - startTime,
            calculatedAt: new Date()
          })
        }

        return map
      },
      ttl: 1800,
      enableLogs: true,
      enableMetrics: true,
    })
  }
}