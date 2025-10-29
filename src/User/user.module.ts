import { Module } from '@nestjs/common';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { UsersPrismaRepository } from '@/User/repositories/users-prisma.repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    UserResolver,
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
    }
  ]
})
export class UserModule {}
