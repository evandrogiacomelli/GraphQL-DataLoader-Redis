import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { User } from '@/User/graphql/models/user'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Dependents } from '@/Dependents/graphql/models/dependents'
import { DependentsLoader } from '@/User/loaders/dependents-loader'

@Resolver()
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [User])
  async users() {
    return this.prisma.user.findMany();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

@Resolver(() => User)
export class UserDependentsResolver {
  //injetando classe loader
  constructor(private dependentsLoader: DependentsLoader) {}

  @ResolveField(() => [Dependents])
  async dependents(@Parent() user: User) {
    //batchload dos ids
    return this.dependentsLoader.batchLoad.load(user.id);
  }
}
