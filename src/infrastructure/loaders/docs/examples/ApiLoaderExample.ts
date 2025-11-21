import { Injectable, Scope } from '@nestjs/common'
import { ApiLoader } from '@/infrastructure/loaders'
import { CacheService } from '@/infrastructure/cache/cache.service'

interface GithubUser {
  login: string
  id: number
  name: string
  avatar_url: string
}

@Injectable({ scope: Scope.REQUEST })
export class GithubUserLoader extends ApiLoader<GithubUser> {
  constructor(cacheService: CacheService) {
    super(cacheService, {
      cachePrefix: 'github-users',
      fetchFn: async (usernames) => {
        const responses = await Promise.all(
          usernames.map(username =>
            fetch(`https://api.github.com/users/${username}`)
              .then(res => res.json())
          )
        )

        const map = new Map<string, GithubUser>()
        responses.forEach((user, index) => {
          map.set(usernames[index], user)
        })

        return map
      },
      ttl: 7200,
      enableLogs: false,
      enableMetrics: true,
    })
  }
}
