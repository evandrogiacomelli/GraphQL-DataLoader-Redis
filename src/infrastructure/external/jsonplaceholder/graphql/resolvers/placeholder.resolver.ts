import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { PlaceholderPostModel } from '../models/placeholder-post.model'
import { PlaceholderUserModel } from '../models/placeholder-user.model'
import { PlaceholderPostLoader } from '@/infrastructure/external/jsonplaceholder/loaders/placeholder-post.loader'
import { PlaceholderUserLoader } from '@/infrastructure/external/jsonplaceholder/loaders/placeholder-user.loader'

@Resolver(() => PlaceholderPostModel)
export class PlaceholderResolver {
  constructor(
    private placeholderPostLoader: PlaceholderPostLoader,
    private placeholderUserLoader: PlaceholderUserLoader
  ) {}

  @Query(() => [PlaceholderPostModel])
  async placeholderPosts(@Args('ids', { type: () => [Int] }) ids: number[]) {
    const posts = await Promise.all(
      ids.map(id => this.placeholderPostLoader.load(String(id)))
    )
    return posts
  }

  @ResolveField(() => PlaceholderUserModel)
  async user(@Parent() post: PlaceholderPostModel) {
    return this.placeholderUserLoader.load(String(post.userId))
  }
}