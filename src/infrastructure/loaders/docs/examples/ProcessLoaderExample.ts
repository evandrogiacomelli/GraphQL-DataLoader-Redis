import { Injectable, Scope } from '@nestjs/common'
import { ProcessLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'

interface UserStats {
  userId: string
  dependentCount: number
  hasActiveDependents: boolean
  lastCalculated: Date
}

@Injectable({ scope: Scope.REQUEST })
export class UserStatsLoader extends ProcessLoader<UserStats> {
  constructor(cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'user-stats',
      processFn: async (userIds) => {
        const stats = await Promise.all(
          userIds.map(async (userId) => {
            const dependentCount = Math.floor(Math.random() * 5)
            const hasActiveDependents = dependentCount > 0

            return {
              userId,
              dependentCount,
              hasActiveDependents,
              lastCalculated: new Date(),
            }
          })
        )

        return new Map(stats.map(s => [s.userId, s]))
      },
      ttl: 1800,
      enableLogs: false,
      enableMetrics: true,
    })
  }
}