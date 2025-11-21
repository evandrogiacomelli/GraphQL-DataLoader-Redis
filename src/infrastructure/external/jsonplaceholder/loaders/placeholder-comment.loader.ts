import { Injectable, Scope } from '@nestjs/common'
import { ApiLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'

export interface PlaceholderComment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

@Injectable({ scope: Scope.REQUEST })
export class PlaceholderCommentLoader extends ApiLoader<PlaceholderComment> {
  constructor(cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'placeholder-comments',
      fetchFn: async (commentIds) => {
        const responses = await Promise.all(
          commentIds.map(id =>
            fetch(`https://jsonplaceholder.typicode.com/comments/${id}`)
              .then(res => res.json())
          )
        )

        return new Map(responses.map((comment, index) => [commentIds[index], comment]))
      },
      ttl: 7200,
      enableLogs: true,
      enableMetrics: true,
    })
  }
}