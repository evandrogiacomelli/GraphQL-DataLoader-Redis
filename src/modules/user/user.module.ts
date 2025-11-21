import { Module } from '@nestjs/common';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { UserService } from './user.service';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { DependentsLoader } from './loaders/DependentsLoader';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    UserResolver,
    DependentsLoader,
  ],
  exports: [UserService],
})
export class UserModule {}