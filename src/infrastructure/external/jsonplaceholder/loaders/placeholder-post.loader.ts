import { Injectable, Scope } from '@nestjs/common'
import { ApiLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'

export interface PlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

@Injectable({ scope: Scope.REQUEST })
export class PlaceholderPostLoader extends ApiLoader<PlaceholderPost> {
  constructor(cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'placeholder-posts',
      fetchFn: async (postIds) => {
        const responses = await Promise.all(
          postIds.map(id =>
            fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
              .then(res => res.json())
          )
        )

        return new Map(responses.map((post, index) => [postIds[index], post]))
      },
      ttl: 7200,
      enableLogs: true,
      enableMetrics: true,
    })
  }
}