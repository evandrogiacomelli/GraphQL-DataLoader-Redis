import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { User } from '@/User/graphql/models/user'
import { Inject } from '@nestjs/common'
import { ListUsersUsecase } from '@/User/usecases/list-user-usecase'
import { SearchParamsArgs } from '@/User/graphql/args/search-params'
import { SearchUserResult } from '@/User/graphql/models/search-user-result'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Dependents } from '@/Dependents/graphql/models/dependents'

@Resolver()
export class UserResolver {
  @Inject(ListUsersUsecase.UseCase)
  private listUserUsecase: ListUsersUsecase.UseCase

  constructor(private prisma: PrismaService) {}

  @Query(() => SearchUserResult)
  users(@Args() { page, perPage, sort, sortDir, filter} : SearchParamsArgs) {
    return this.listUserUsecase.execute({
      page,
      perPage,
      sort,
      sortDir,
      filter,
    });
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

@Resolver(() => User)
export class UserDependentsResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField(() => [Dependents])
  async dependents(@Parent() user: User) {
    return this.prisma.dependent.findMany({ where: { userId: user.id } });
  }
}
