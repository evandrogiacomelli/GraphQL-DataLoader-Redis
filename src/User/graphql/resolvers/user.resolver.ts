import { Args, Query, Resolver } from '@nestjs/graphql'
import { User } from '@/User/graphql/models/user'
import { Inject } from '@nestjs/common'
import { ListUsersUsecase } from '@/User/usecases/list-user-usecase'
import { SearchParamsArgs } from '@/User/graphql/args/search-params'
import { SearchUserResult } from '@/User/graphql/models/search-user-result'

@Resolver(() => SearchUserResult)
export class UserResolver {
  @Inject(ListUsersUsecase.UseCase)
  private listUserUsecase: ListUsersUsecase.UseCase

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
}
