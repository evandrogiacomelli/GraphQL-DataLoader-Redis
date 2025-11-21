import { Injectable, Scope } from '@nestjs/common'
import { ApiLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'

export interface PlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

@Injectable({ scope: Scope.REQUEST })
export class PlaceholderUserLoader extends ApiLoader<PlaceholderUser> {
  constructor(cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'placeholder-users',
      fetchFn: async (userIds) => {
        const responses = await Promise.all(
          userIds.map(id =>
            fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
              .then(res => res.json())
          )
        )

        return new Map(responses.map((user, index) => [userIds[index], user]))
      },
      ttl: 7200,
      enableLogs: true,
      enableMetrics: true,
    })
  }
}