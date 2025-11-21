import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql'
import { PostModel } from '../models/post.model'
import { User } from '@/modules/user/graphql/models/user'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { AuthorLoader } from '@/modules/post/loaders/author.loader'

@Resolver(() => PostModel)
export class PostResolver {
  constructor(
    private prisma: PrismaService,
    private authorLoader: AuthorLoader
  ) {}

  @Query(() => [PostModel])
  async posts() {
    return this.prisma.post.findMany()
  }

  @ResolveField(() => User)
  async author(@Parent() post: PostModel) {
    return this.authorLoader.load(post.authorId)
  }
}