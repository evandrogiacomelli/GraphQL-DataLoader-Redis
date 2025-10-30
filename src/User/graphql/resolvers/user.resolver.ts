import { Query, Resolver } from '@nestjs/graphql'
import { User } from '@/User/graphql/models/user'
import { Inject } from '@nestjs/common'
import { ListUsersUsecase } from '@/User/usecases/list-user-usecase'

@Resolver(() => User)
export class UserResolver {
  @Inject('ListUsersUsecase')
  private listUserUsecase: ListUsersUsecase.UseCase

  @Query(() => [User])
  users() {
    return this.prisma.author.findMany();
  }
}
