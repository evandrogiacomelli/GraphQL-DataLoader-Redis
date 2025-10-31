import { Module } from '@nestjs/common';
import { UserDependentsResolver, UserResolver } from './graphql/resolvers/user.resolver';
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
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
    }
  ]
})
export class UserModule {}
