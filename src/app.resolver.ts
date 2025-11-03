import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CacheService } from '@/cache/cache.service'

@Resolver()
export class AppResolver {
  constructor(private readonly cacheService: CacheService) {}


  @Query( () => String)
  hello(): string {
    return 'Olá Dev';
  }

  @Mutation( () => String)
  async message(
      @Args("message") message: string,
  ): Promise<string | null> {

    const key = 'key'
    await this.cacheService.set(key, message);
    console.log('redis message: ', await this.cacheService.get(key));
    return await this.cacheService.get(key);
  }

}
