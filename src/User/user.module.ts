import { Module } from '@nestjs/common';
import { UserDependentsResolver, UserResolver } from './graphql/resolvers/user.resolver';
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { UsersPrismaRepository } from '@/User/repositories/users-prisma.repository'
import { ListUsersUsecase } from '@/User/usecases/list-user-usecase'
import { DependentsLoader } from '@/User/loaders/dependents-loader'

@Module({
  imports: [DatabaseModule],
  providers: [
    UserResolver,
    UserDependentsResolver,
    DependentsLoader,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UsersRepository',
      useFactory: (prisma: PrismaService) => {
        return new UsersPrismaRepository(prisma);
      },
      inject: ['PrismaService'],
    },
    {
      provide: ListUsersUsecase.UseCase,
      useFactory: (usersRepository: UsersPrismaRepository)  => {
        return new ListUsersUsecase.UseCase(usersRepository)
      },
      inject: ['UsersRepository'],
    }
  ]
})
export class UserModule {}
