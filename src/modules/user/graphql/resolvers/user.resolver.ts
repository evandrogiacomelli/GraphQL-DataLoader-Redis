import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '@/modules/user/graphql/models/user';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { Dependents } from '@/modules/dependent/graphql/models/dependents';
import { DependentsLoader } from '@/modules/user/loaders/DependentsLoader';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dependentsLoader: DependentsLoader,
  ) {}

  @Query(() => [User])
  async users() {
    return this.prisma.user.findMany();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  @ResolveField(() => [Dependents])
  async dependents(@Parent() user: User) {
    return this.dependentsLoader.load(user.id);
  }
}