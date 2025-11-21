import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CacheService } from '@/infrastructure/cache/cache.service';

@Resolver()
export class AppResolver {
  constructor(private readonly cacheService: CacheService) {}

  @Query(() => String)
  hello(): string {
    return 'Olá Dev';
  }

  @Mutation(() => String)
  async message(@Args('message') message: string): Promise<string | null> {
    const key = 'key';
    await this.cacheService.set(key, message);
    const cachedValue = await this.cacheService.get(key);
    console.log('redis message:', cachedValue);
    return cachedValue;
  }

  @Mutation(() => String)
  async storeParamAsKey(
    @Args('key') key: string,
    @Args('value') value: string,
  ): Promise<string | null> {
    console.log(key, value);
    await this.cacheService.set(key, value);
    const cachedValue = await this.cacheService.get(key);
    console.log('key stored:', key, '| redis message:', cachedValue);
    return cachedValue;
  }
}
